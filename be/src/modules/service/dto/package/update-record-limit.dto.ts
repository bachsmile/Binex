import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePackageRecordLimitDto {
  @ApiProperty({
    example: 'wedding',
    description: 'Key giới hạn (đã định nghĩa trong LimitType)',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: 10,
    description: 'Giá trị giới hạn (0 là không giới hạn)',
  })
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
