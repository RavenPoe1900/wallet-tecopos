import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JobEvents } from './enums/events.enum';

@Injectable()
export class QueueProducer implements OnModuleInit {
  constructor(
    @InjectQueue('notificationQueues') private readonly queue: Queue,
  ) {}

  // ✅ Mejor que usar constructor
  async onModuleInit() {
    // ===== EMAILS =====
    await this.dispararEnvioEmail({
      to: 'user1@email.com',
      subject: 'Bienvenido 🚀',
    });

    await this.dispararEnvioEmail({
      to: 'user2@email.com',
      subject: 'Verifica tu cuenta ✅',
    });

    // ===== PAGOS =====
    await this.dispararPago({
      userId: 'user_123',
      amount: 100,
    });

    await this.dispararPago({
      userId: 'user_456',
      amount: 250,
    });
  }

  async dispararEnvioEmail(payload: { to: string; subject: string }) {
    await this.queue.add(JobEvents.SEND_EMAIL, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });
  }

  async dispararPago(payload: { userId: string; amount: number }) {
    await this.queue.add(JobEvents.PROCESS_PAYMENT, payload, {
      priority: 1,
    });
  }
}
