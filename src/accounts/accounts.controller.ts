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
import { PaginationAccountDto } from './dtos/pagination-account.dto';
import { AccountResponseDto } from './dtos/account-response.dto';
import { AccountsService } from './accounts.service';
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
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateAccountDto } from './dtos/account.dto';

@ApiTags('Accounts')
@Controller({ path: 'accounts', version: '1' })
export class AccountsController implements GenericApplicationCrudServicePort<
  CreateAccountDto,
  UpdateAccountDto,
  AccountResponseDto,
  PaginationAccountDto
> {
  constructor(private readonly service: AccountsService) {}

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(AccountResponseDto, 'Accounts'))
  create(@Body() dto: CreateAccountDto): Promise<AccountResponseDto> {
    return this.service.createOne(dto);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(AccountResponseDto, 'Accounts'))
  findAll(
    @Query() pagination: PaginationAccountDto,
  ): Promise<PaginatedResponse<AccountResponseDto>> {
    return this.service.findPaginated(pagination as any);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(AccountResponseDto, 'Accounts'))
  findOne(@Param('id') id: string): Promise<AccountResponseDto | null> {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(AccountResponseDto, 'Accounts'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.service.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(AccountResponseDto, 'Accounts'))
  remove(@Param('id') id: string): Promise<AccountResponseDto> {
    return this.service.removeOne(id);
  }
}
