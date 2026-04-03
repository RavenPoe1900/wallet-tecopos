import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaGenericService } from 'common/generic/prisma-generic.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionResponseDto } from './dtos/transaction-response.dto';
import { CreateTransactionDto } from './dtos/transaction.dto';
import { PaginatedResponse } from 'common/dtos/paginationResponse.dto';

@Injectable()
export class TransactionsService extends PrismaGenericService<
  Transaction,
  Prisma.TransactionCreateArgs,
  Prisma.TransactionFindManyArgs,
  Prisma.TransactionFindUniqueArgs,
  Prisma.TransactionUpdateArgs,
  Prisma.TransactionDeleteArgs
> {
  constructor(prismaService: PrismaService) {
    super(prismaService.transaction);
  }

  async createOne(dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const args: Prisma.TransactionCreateArgs = {
      data: dto,
    };
    const transaction: Transaction = await super.create(args);
    return this.toResponseDto(transaction);
  }

  async findPaginated(
    params: Prisma.TransactionFindManyArgs,
  ): Promise<PaginatedResponse<TransactionResponseDto>> {
    const page = await super.findAll(params);
    return {
      ...page,
      data: page.data.map((transaction) => this.toResponseDto(transaction)),
    };
  }

  async findById(id: string): Promise<TransactionResponseDto | null> {
    const transaction: Transaction | null = await super.findOne({
      where: { id },
    });
    return transaction ? this.toResponseDto(transaction) : null;
  }

  async updateOne(
    id: string,
    data: Prisma.TransactionUpdateInput,
  ): Promise<TransactionResponseDto> {
    const updated: Transaction = await super.update(
      { where: { id } },
      { where: { id }, data },
    );
    return this.toResponseDto(updated);
  }

  async removeOne(id: string): Promise<TransactionResponseDto> {
    const removed = await super.remove({ where: { id } }, { where: { id } });
    return this.toResponseDto(removed);
  }

  toResponseDto(transaction: Transaction): TransactionResponseDto {
    return Object.assign(new TransactionResponseDto(), {
      id: transaction.id,
      accountId: transaction.accountId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }
}
