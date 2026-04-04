import { AccountsService } from 'src/accounts/accounts.service';
import { CreateTransactionDto } from '../dtos/transaction.dto';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Account } from '@prisma/client';

@Injectable()
export class ValidateTransactionPipe implements PipeTransform {
  constructor(private readonly userService: AccountsService) {}

  async transform(value: CreateTransactionDto): Promise<CreateTransactionDto> {
    if (value.accountId) {
      const account: Account = await this.getUser(value.accountId);
      const amount = parseFloat(String(value.amount));
      if (isNaN(amount)) {
        throw new BadRequestException(
          'Transaction amount must be a valid number.',
        );
      }
      const balance = parseFloat(String(account.balance));
      if (balance < amount)
        throw new BadRequestException(
          'The specified account not have this amount.',
        );
      value.walletId = account.walletId;
    }
    return value;
  }

  private getUser(accountId: string): Promise<Account> {
    return this.userService.findOne({
      where: { id: accountId },
    });
  }
}
