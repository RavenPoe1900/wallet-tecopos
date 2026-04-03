import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UsersModule } from 'src/users/users.module';

export const MODULES = [
  UsersModule,
  AuthModule,
  TransactionsModule,
  AccountsModule,
];
