import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePackageDto {
  @ApiProperty({ example: '01HR...', description: 'ID của gói mới muốn chuyển đổi' })
  @IsString()
  @IsNotEmpty()
  newPackageId: string;
}
