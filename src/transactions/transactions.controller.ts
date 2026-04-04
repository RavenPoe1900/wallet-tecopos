import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationTransactionDto } from './dtos/pagination-transaction.dto';
import { TransactionResponseDto } from './dtos/transaction-response.dto';
import { TransactionsService } from './transactions.service';
import { ApiResponseSwagger } from 'common/swagger/response.swagger';
import {
  createSwagger,
  findOneSwagger,
  findSwagger,
} from 'common/swagger/http.swagger';
import { PaginatedResponse } from 'common/dtos/paginationResponse.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateTransactionDto } from './dtos/transaction.dto';
import { ValidateTransactionPipe } from './guards/payment.guard';

@ApiTags('Transactions')
@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(TransactionResponseDto, 'Transactions'))
  create(
    @Body(ValidateTransactionPipe) dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.service.createOne(dto);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(TransactionResponseDto, 'Transactions'))
  findAll(
    @Query() pagination: PaginationTransactionDto,
  ): Promise<PaginatedResponse<TransactionResponseDto>> {
    return this.service.findPaginated(pagination as any);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(TransactionResponseDto, 'Transactions'))
  findOne(@Param('id') id: string): Promise<TransactionResponseDto | null> {
    return this.service.findById(id);
  }

  // @Patch(':id')
  // @Roles(Role.USER)
  // @HttpCode(HttpStatus.ACCEPTED)
  // @ApiResponseSwagger(updateSwagger(TransactionResponseDto, 'Transactions'))
  // update(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateTransactionDto,
  // ): Promise<TransactionResponseDto> {
  //   return this.service.updateOne(id, dto);
  // }

  // @Delete(':id')
  // @Roles(Role.USER)
  // @HttpCode(HttpStatus.ACCEPTED)
  // @ApiResponseSwagger(deleteSwagger(TransactionResponseDto, 'Transactions'))
  // remove(@Param('id') id: string): Promise<TransactionResponseDto> {
  //   return this.service.removeOne(id);
  // }
}
