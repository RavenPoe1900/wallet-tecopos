import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  IsDecimal,
  MaxLength,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({
    description:
      'Unique identifier of the account associated with the transaction',
    example: 'a3f5c2b4-6d8e-4f1a-9c2b-123456789abc',
  })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description:
      'Transaction amount as a decimal string (up to 19 digits and 4 decimal places)',
    example: '1500.2500',
  })
  @IsDecimal({ decimal_digits: '0,4' })
  amount: string;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({
    description:
      'Optional description providing additional details about the transaction',
    example: 'Monthly subscription payment',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
