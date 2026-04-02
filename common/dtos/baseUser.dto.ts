import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseUserDto {
  /**
   * @example 'P@ssw0rd!'
   * @description The password for the user. Must meet the following criteria:
   * - Must be a string.
   * - Must be between 8 and 20 characters long.
   * - Must contain at least one uppercase letter.
   * - Must contain at least one lowercase letter.
   * - Must contain at least one number.
   * - Must contain at least one special character (e.g., !@#$%^&*).
   */
  @ApiProperty({
    description: `The password for the user. Must contain at least 8 characters, one uppercase letter, 
        one lowercase letter, one number, and one special character.`,
    example: 'P@ssw0rd!',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*\W)/, {
    message: 'Password must contain at least one special character',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  /**
   * @example 'hello@domain.com'
   * @description The email address of the user. Must be a valid email format.
   */
  @ApiProperty({
    example: 'hello@domain.com',
    description: 'Email of the user',
  })
  @Expose()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
