import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ResumeQueueProcessor } from './resume-queue.processor';
import { QueueConsumer } from './queue.consumer';
import { CircuitBreakerProvider } from './providers/circuit-breaker.provider';
import { ExternalService } from 'src/externals/external.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notificationQueues' }),
    BullModule.registerQueue({ name: 'resumeQueue' }),
    TransactionsModule,
    AccountsModule,
  ],
  providers: [
    QueueConsumer,
    ResumeQueueProcessor,
    CircuitBreakerProvider,
    ExternalService,
  ],
})
export class QueueModule {}
