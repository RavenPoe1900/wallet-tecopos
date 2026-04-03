import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ResumeQueueProcessor } from './resume-queue.processor';
import { QueueProducer } from './queue.producer';
import { QueueConsumer } from './queue.consumer';
import { CircuitBreakerProvider } from './providers/circuit-breaker.provider';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notificationQueues' }),
    BullModule.registerQueue({ name: 'resumeQueue' }),
  ],
  providers: [
    QueueProducer,
    QueueConsumer,
    ResumeQueueProcessor,
    CircuitBreakerProvider,
  ],
  exports: [QueueProducer],
})
export class QueueModule {}
