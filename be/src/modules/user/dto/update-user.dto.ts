import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/decorators/roles.decorator';

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

  @IsString()
  @IsOptional()
  role: Role;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  isDeleted: boolean;

  @IsString()
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
