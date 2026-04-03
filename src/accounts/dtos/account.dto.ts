import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Unique identifier of the user who owns the account',
    example: 'b3f29c6e-1c2a-4f5a-8d9e-123456789abc',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;

  @ApiPropertyOptional({
    description: 'Initial account balance. Defaults to 0 if not provided',
    example: '1000.0000',
  })
  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '0,4' },
    { message: 'balance must be a valid decimal with up to 4 decimal places' },
  )
  @Type(() => String)
  balance?: string;

  @ApiPropertyOptional({
    description: 'Currency of the account (ISO 4217)',
    enum: Currency,
    example: Currency.USD,
    default: Currency.USD,
  })
  @IsNotEmpty()
  @IsEnum(Currency, { message: 'currency must be a valid Currency enum value' })
  currency: Currency;
}
