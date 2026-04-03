import { PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
