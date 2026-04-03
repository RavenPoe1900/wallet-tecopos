import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JobEvents } from './enums/events.enum';
import { QUEUE_CONFIG } from './config/env.config';

@Injectable()
export class QueueProducer implements OnModuleInit {
  private readonly logger = new Logger(QueueProducer.name);

  constructor(
    @InjectQueue('notificationQueues') private readonly queue: Queue,
  ) {}

  async onModuleInit() {
    await this.dispararPago({ userId: 'user_123', amount: 100 });
    await this.dispararPago({ userId: 'user_456', amount: 250 });
  }

  async dispararPago(payload: { userId: string; amount: number }) {
    await this.queue.add(JobEvents.PROCESS_PAYMENT, payload, {
      priority: QUEUE_CONFIG.MIN_PRIORITY,
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 0,
    });

    this.logger.log(`Payment queued → ${payload.userId}`);
  }
}
