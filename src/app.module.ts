import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MODULES } from 'common/config/config-modules';
import { BullModule } from '@nestjs/bullmq';
import { StringValue } from 'ms';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthGuard } from './auth/guards/auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-key',
      global: true,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '48h') as StringValue,
      },
    }),
    ...MODULES,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
