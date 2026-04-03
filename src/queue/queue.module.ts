import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueProducer } from './queues.producer';
import { QueueConsumer } from './queues.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: 'notificationQueues' })],
  providers: [QueueProducer, QueueConsumer],
  exports: [QueueProducer],
})
export class QueueModule {}
