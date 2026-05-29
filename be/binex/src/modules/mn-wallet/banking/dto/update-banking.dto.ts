import { PartialType } from '@nestjs/swagger';
import { CreateBankingDto } from './create-banking.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBankingDto extends PartialType(CreateBankingDto) {
  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
