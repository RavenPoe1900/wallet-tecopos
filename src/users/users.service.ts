import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaGenericService } from 'common/generic/prisma-generic.service';
import { BcryptHasherService } from 'common/security/bcrypt.service';
import { UserDto } from './dtos/user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { userSelectWithoutPassword } from './dtos/user.select';
import { PaginatedResponse } from 'common/dtos/paginationResponse.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService extends PrismaGenericService<
  User,
  Prisma.UserCreateArgs,
  Prisma.UserFindManyArgs,
  Prisma.UserFindUniqueArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserDeleteArgs
> {
  constructor(
    prismaService: PrismaService,
    private readonly bcryptHasherService: BcryptHasherService,
  ) {
    super(prismaService.user, {
      modelName: 'User',
      errorDictionary: {
        User: {
          unique: {
            email: 'A user with that email already exists.',
          },
        },
      },
    });
  }

  async createOne(dto: UserDto): Promise<UserResponseDto> {
    const args: Prisma.UserCreateArgs = {
      data: {
        password: await this.bcryptHasherService.hash(dto.password),
        email: dto.email,
      },
      select: userSelectWithoutPassword,
    };
    const user: User = await super.create(args);
    return this.toResponseDto(user);
  }

  async findPaginated(
    params: Prisma.UserFindManyArgs,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const page = await super.findAll(params);
    return {
      ...page,
      data: page.data.map((user) => this.toResponseDto(user)),
    };
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user: User | null = await super.findOne({
      where: { id: id, deletedAt: null },
      select: userSelectWithoutPassword,
    });
    return user ? this.toResponseDto(user) : null;
  }

  async updateOne(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserResponseDto> {
    data.password = await this.hashPasswordField(data.password);
    const updated: User = await super.update(
      { where: { id } },
      { where: { id }, data, select: userSelectWithoutPassword },
    );
    return this.toResponseDto(updated);
  }

  async removeOne(id: string): Promise<UserResponseDto> {
    const removed = await super.remove(
      { where: { id } },
      { where: { id }, select: userSelectWithoutPassword },
    );
    return this.toResponseDto(removed);
  }

  toResponseDto(user: User): UserResponseDto {
    return Object.assign(new UserResponseDto(), {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  private async hashPasswordField(
    value?: string | Prisma.StringFieldUpdateOperationsInput,
  ) {
    if (typeof value === 'string') {
      return await this.bcryptHasherService.hash(value);
    }

    if (value && 'set' in value && typeof value.set === 'string') {
      return {
        set: await this.bcryptHasherService.hash(value.set),
      };
    }

    return value;
  }
}
