import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  id: string;
}
