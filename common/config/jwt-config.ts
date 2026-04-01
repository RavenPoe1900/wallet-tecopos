import { JwtModuleOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

const expires = process.env.JWT_EXPIRES_IN ?? '48h';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET || 'default-secret-key',
  global: true,
  signOptions: {
    expiresIn: expires as StringValue,
  },
};
