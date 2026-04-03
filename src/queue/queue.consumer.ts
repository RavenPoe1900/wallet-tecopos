import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
  InjectQueue,
} from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job, Queue, DelayedError } from 'bullmq';
import { BrokenCircuitError } from 'cockatiel';
import { JobEvents } from './enums/events.enum';
import { QUEUE_CONFIG } from './config/env.config';

@Processor('notificationQueues')
export class QueueConsumer extends WorkerHost {
  private readonly logger = new Logger(QueueConsumer.name);

  constructor(
    @InjectQueue('notificationQueues') private readonly queue: Queue,
    @InjectQueue('resumeQueue') private readonly resumeQueue: Queue,
    @Inject('COCKATIEL_POLICY') private readonly policy,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case JobEvents.PROCESS_PAYMENT:
        return this.handleProcessPayment(job);
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  private async handleProcessPayment(job: Job) {
    const { userId, amount } = job.data;

    try {
      await this.policy.execute(async () => {
        this.logger.log(`Processing payment → ${userId} $${amount}`);
        throw new Error('Simulated payment error');
      });
    } catch (err) {
      if (err instanceof BrokenCircuitError) {
        this.logger.warn(
          `Circuit breaker OPEN — failing fast for job id=${job.id}`,
        );
      }

      await this.pauseAndScheduleResume(job);

      await job.changePriority({ priority: QUEUE_CONFIG.RETRY_PRIORITY });
      this.logger.log(
        `Job id=${job.id} priority escalated to ${QUEUE_CONFIG.RETRY_PRIORITY}`,
      );

      await job.moveToDelayed(
        Date.now() + QUEUE_CONFIG.PAUSE_DURATION_MS,
        job.token,
      );

      throw new DelayedError();
    }
  }

  private async pauseAndScheduleResume(job: Job): Promise<void> {
    await this.queue.pause();

    this.logger.warn(
      `notificationQueues paused — job id=${job.id} will retry in ${QUEUE_CONFIG.PAUSE_DURATION_MS}ms`,
    );

    await this.resumeQueue.add(
      JobEvents.RESUME_QUEUE,
      {},
      {
        delay: QUEUE_CONFIG.PAUSE_DURATION_MS,
        jobId: JobEvents.RESUME_QUEUE,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`✅ Completed [${job.name}] id=${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `❌ Failed [${job.name}] id=${job.id} — ${error.message}`,
    );
  }
}
