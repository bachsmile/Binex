import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDepositRequestDto {
  @ApiProperty({
    example: 'evn_receiver_wallet_address_here',
    description: 'Địa chỉ ví nhận tiền',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ example: 50000, description: 'Số tiền muốn nạp' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.000001)
  amount: number;

  @ApiProperty({
    example: 'VND',
    description: 'Loại tiền tệ (VND hoặc USD/USDT)',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    example: 'https://example.com/proof.jpg',
    description: 'Ảnh minh chứng giao dịch đã chuyển khoản',
  })
  @IsString()
  @IsNotEmpty()
  proofImage: string;

  @ApiProperty({
    example: 'TXN123456789',
    description: 'Mã giao dịch ngân hàng hoặc nội dung chuyển khoản',
  })
  @IsString()
  @IsNotEmpty()
  transactionCode: string;
}
