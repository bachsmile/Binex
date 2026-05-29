import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'wallet 1' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'key1 key2 ... key12' })
  privateKey: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  publicKey: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  pin: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  userId: string;
}
