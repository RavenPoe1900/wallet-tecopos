import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobEvents } from './enums/events.enum';

@Processor('notificationQueues')
export class QueueConsumer extends WorkerHost {
  // Maneja TODOS los jobs — filtra por nombre
  async process(job: Job): Promise<any> {
    switch (job.name) {
      case JobEvents.SEND_EMAIL:
        return this.handleSendEmail(job);
      case JobEvents.PROCESS_PAYMENT:
        return this.handleProcessPayment(job);
      case JobEvents.GENERATE_REPORT:
        return this.handleGenerateReport(job);
      default:
        throw new Error(`Job desconocido: ${job.name}`);
    }
  }

  private async handleSendEmail(job: Job) {
    const { to, subject } = job.data;
    console.log(`Enviando email a ${to} con asunto: ${subject}`);
    // lógica de envío...
  }

  private async handleProcessPayment(job: Job) {
    const { userId, amount } = job.data;
    console.log(`Procesando pago de ${amount} para usuario ${userId}`);
    // lógica de pago...
  }

  private async handleGenerateReport(job: Job) {
    console.log('Generando reporte...');
  }

  // Eventos del worker
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`✅ Job ${job.name} completado (id: ${job.id})`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`❌ Job ${job.name} falló: ${error.message}`);
  }
}
