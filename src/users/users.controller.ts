import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserDto } from './dtos/user.dto';
import { PaginationUserDto } from './dtos/pagination-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersService } from './users.service';
import { ApiResponseSwagger } from 'common/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'common/swagger/http.swagger';
import { PaginatedResponse } from 'common/dtos/paginationResponse.dto';
import { GenericApplicationCrudServicePort } from 'common/generic/generic-application-crud.service.port';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController implements GenericApplicationCrudServicePort<
  UserDto,
  UpdateUserDto,
  UserResponseDto,
  PaginationUserDto
> {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(UserResponseDto, 'Users'))
  create(@Body() dto: UserDto): Promise<UserResponseDto> {
    return this.service.createOne(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(UserResponseDto, 'Users'))
  findAll(
    @Query() pagination: PaginationUserDto,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    return this.service.findPaginated(pagination as any);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(UserResponseDto, 'Users'))
  findOne(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(UserResponseDto, 'Users'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.service.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(UserResponseDto, 'Users'))
  remove(@Param('id') id: string): Promise<UserResponseDto> {
    return this.service.removeOne(id);
  }
}
