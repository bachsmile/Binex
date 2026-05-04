import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  TransactionType,
  TransactionStatus,
} from '../../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({ example: '0xB...' })
  @IsString()
  @IsOptional()
  fromAddress?: string;

  @ApiProperty({ example: '0xB...' })
  @IsString()
  @IsOptional()
  toAddress?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'VND' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({ enum: TransactionStatus, default: TransactionStatus.SUCCESS })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @ApiProperty({ example: 'Chuyển tiền cho bạn' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId?: string;
}
