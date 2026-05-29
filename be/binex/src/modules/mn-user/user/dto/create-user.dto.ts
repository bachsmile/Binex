import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Role } from '../../enum/role.enum';
import { UserStatus } from '../../enum/status.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: Role,
    required: false,
    default: Role.USER,
  })
  @IsString()
  @IsOptional()
  role?: Role;

  @ApiProperty({
    enum: UserStatus,
    required: false,
    default: UserStatus.ACTIVE,
  })
  @IsString()
  @IsOptional()
  status?: UserStatus;
}
