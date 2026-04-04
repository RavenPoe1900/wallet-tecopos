import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user.',
    example: 101,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: "The user's email address.",
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The timestamp when the user account was created.',
    format: 'date-time',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the user account was last updated.',
    format: 'date-time',
    example: '2025-07-14T14:30:00Z',
  })
  updatedAt: Date;
}
