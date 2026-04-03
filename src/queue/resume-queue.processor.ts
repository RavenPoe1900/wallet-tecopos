import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { JobEvents } from './enums/events.enum';

// Dedicated processor — only responsible for resuming notificationQueues
@Processor('resumeQueue')
export class ResumeQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(ResumeQueueProcessor.name);

  constructor(
    // Injects the queue it needs to resume — not its own queue
    @InjectQueue('notificationQueues')
    private readonly notificationQueue: Queue,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case JobEvents.RESUME_QUEUE:
        return this.handleResumeQueue();
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  // Resumes notificationQueues after 60s pause
  private async handleResumeQueue(): Promise<void> {
    await this.notificationQueue.resume();
    this.logger.log('notificationQueues resumed — retrying pending jobs');
  }
}
