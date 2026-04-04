import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { BcryptHasherService } from 'common/security/bcrypt.service';
import { JwtPayload } from './intefaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly bcryptHasherService: BcryptHasherService,
  ) {}

  async signIn(email: string, password: string) {
    const user: User | null = await this.usersService.findOne({
      where: { email },
    });

    const isPasswordValid = await this.bcryptHasherService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
