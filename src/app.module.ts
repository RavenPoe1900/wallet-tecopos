import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MODULES } from 'common/config/config-modules';
import { jwtConfig } from 'common/config/jwt-config';
import { PrismaModule } from './prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    JwtModule.register(jwtConfig),
    PrismaModule,
    ...MODULES,
  ],
})
export class AppModule {}
