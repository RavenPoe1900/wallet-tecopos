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
import { ExternalService } from 'src/externals/external.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { WalletTransaction } from 'common/interfaces/wallet-transaction.interface';
import { Account, Prisma, TransactionStatus } from '@prisma/client';
import { AccountsService } from 'src/accounts/accounts.service';

@Processor('notificationQueues')
export class QueueConsumer extends WorkerHost {
  private readonly logger = new Logger(QueueConsumer.name);

  constructor(
    @InjectQueue('notificationQueues') private readonly queue: Queue,
    @InjectQueue('resumeQueue') private readonly resumeQueue: Queue,
    @Inject('COCKATIEL_POLICY') private readonly policy,
    private readonly externalService: ExternalService,
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case JobEvents.PROCESS_PAYMENT:
        return this.handleProcessPayment(job);
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  private async handleProcessPayment(job: Job) {
    const { walletId, id, amount, accountId }: WalletTransaction = job.data;
    try {
      await this.policy.execute(async () => {
        this.logger.log(`Processing payment → ${walletId} $${amount}`);
        await this.externalService.getData(job.data);
        await this.updateAccountAndTransaction(id, amount, accountId);
      });
    } catch (err) {
      if (err instanceof BrokenCircuitError) {
        this.logger.warn(
          `Circuit breaker OPEN — failing fast for job id=${job.id}`,
        );
      }
      const data = { status: TransactionStatus.FAILED };
      await this.transactionsService.update(
        { where: { id } },
        { where: { id }, data },
      );

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

  private async updateAccountAndTransaction(
    id: string,
    amount: string,
    accountId: string,
  ): Promise<void> {
    let data = { status: TransactionStatus.COMPLETED };

    const account: Account = await this.accountsService.findOne({
      where: { id: accountId },
    });
    const accountAmount = parseFloat(String(amount));

    const balance = parseFloat(String(account.balance));
    if (balance < accountAmount) data = { status: TransactionStatus.COMPLETED };
    else {
      const dataBalance: Prisma.AccountUpdateInput = {
        balance: balance - accountAmount,
      };
      await this.accountsService.updateOne(accountId, dataBalance);
    }
    await this.transactionsService.update(
      { where: { id } },
      { where: { id }, data },
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
