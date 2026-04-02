import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { BcryptHasherService } from 'common/security/bcrypt.service';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, BcryptHasherService],
  exports: [UsersService],
})
export class UsersModule {}
