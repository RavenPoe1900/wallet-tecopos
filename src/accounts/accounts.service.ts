import { Injectable } from '@nestjs/common';
import { Prisma, Account } from '@prisma/client';
import { PrismaGenericService } from 'common/generic/prisma-generic.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountResponseDto } from './dtos/account-response.dto';
import { CreateAccountDto } from './dtos/account.dto';
import { PaginatedResponse } from 'common/dtos/paginationResponse.dto';

@Injectable()
export class AccountsService extends PrismaGenericService<
  Account,
  Prisma.AccountCreateArgs,
  Prisma.AccountFindManyArgs,
  Prisma.AccountFindUniqueArgs,
  Prisma.AccountUpdateArgs,
  Prisma.AccountDeleteArgs
> {
  constructor(prismaService: PrismaService) {
    super(prismaService.account);
  }

  async createOne(dto: CreateAccountDto): Promise<AccountResponseDto> {
    const args: Prisma.AccountCreateArgs = {
      data: dto,
    };
    const account: Account = await super.create(args);
    return this.toResponseDto(account);
  }

  async findPaginated(
    params: Prisma.AccountFindManyArgs,
  ): Promise<PaginatedResponse<AccountResponseDto>> {
    const page = await super.findAll(params);
    return {
      ...page,
      data: page.data.map((account) => this.toResponseDto(account)),
    };
  }

  async findById(id: string): Promise<AccountResponseDto | null> {
    const account: Account | null = await super.findOne({
      where: { id },
    });
    return account ? this.toResponseDto(account) : null;
  }

  async updateOne(
    id: string,
    data: Prisma.AccountUpdateInput,
  ): Promise<AccountResponseDto> {
    const updated: Account = await super.update(
      { where: { id } },
      { where: { id }, data },
    );
    return this.toResponseDto(updated);
  }

  async removeOne(id: string): Promise<AccountResponseDto> {
    const removed = await super.remove({ where: { id } }, { where: { id } });
    return this.toResponseDto(removed);
  }

  toResponseDto(account: Account): AccountResponseDto {
    return Object.assign(new AccountResponseDto(), {
      id: account.id,
      userId: account.userId,
      balance: account.balance,
      currency: account.currency,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }
}
