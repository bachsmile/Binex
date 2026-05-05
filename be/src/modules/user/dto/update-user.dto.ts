import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';
import { UserStatus } from '../entities/user.entity';
import { IsBoolean, IsDate, IsEnum } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  zip: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @IsDate()
  @IsOptional()
  deletedAt: Date;

  @IsString()
  @IsOptional()
  deletedBy: string;

  @IsString()
  @IsOptional()
  createdBy: string;

  @IsString()
  @IsOptional()
  updatedBy: string;

  @IsString()
  @IsOptional()
  managerIds: string[];

  @IsString()
  @IsOptional()
  moduleRoles: number[];

  @IsString()
  @IsOptional()
  walletIds: string[];

  @IsString()
  @IsOptional()
  packageIds: string[];
}
