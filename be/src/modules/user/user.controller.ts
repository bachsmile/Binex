import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ExtendPermissionDto } from './dto/extend-permission.dto';
import { ChangePackageDto } from './dto/change-package.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles, Role } from 'src/decorators/roles.decorator';
import { UserStatus } from './entities/user.entity';
import { CheckPermissions } from 'src/decorators/permissions.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/permissions')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh sách quyền của người dùng' })
  updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.userService.updatePermissions(id, updatePermissionDto);
  }

  @Patch('permission/:id/extend')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Gia hạn quyền của người dùng' })
  @ApiParam({
    name: 'id',
    description: 'ID của quyền (UserPermission) cần gia hạn',
  })
  extendPermission(
    @Param('id') id: string,
    @Body() extendPermissionDto: ExtendPermissionDto,
  ) {
    return this.userService.extendPermission(id, extendPermissionDto.days);
  }

  @Patch('permission/:id/change-package')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Đổi gói dịch vụ của người dùng' })
  @ApiParam({
    name: 'id',
    description: 'ID của quyền (UserPermission) cần đổi gói',
  })
  changePackage(
    @Param('id') id: string,
    @Body() changePackageDto: ChangePackageDto,
  ) {
    return this.userService.changePackage(id, changePackageDto.newPackageId);
  }

  @Get(':userId/permissions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Lấy danh sách quyền của người dùng' })
  getUserPermissions(@Param('userId') userId: string) {
    return this.userService.getUserPermissions(userId);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  @CheckPermissions('User', 1)
  findAll(@Query('status') status?: UserStatus, @Query('role') role?: Role) {
    return this.userService.findAll(status, role);
  }

  @Get('page')
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách người dùng phân trang' })
  findPage(
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: UserStatus,
    @Query('role') role?: Role,
  ) {
    return this.userService.findPage(
      Number(pageNumber) || 1,
      Number(pageSize) || 10,
      status,
      role,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch(':id/storage-limit')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Cập nhật giới hạn dung lượng riêng cho người dùng',
  })
  updateStorageLimit(
    @Param('id') id: string,
    @Body('storageLimit') storageLimit: number,
  ) {
    return this.userService.updateStorageLimit(id, storageLimit);
  }

  @Patch(':id/record-limit')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật bản đồ giới hạn bản ghi (JSON) cho người dùng' })
  updateRecordLimit(
    @Param('id') id: string,
    @Body('recordLimit') recordLimit: object,
  ) {
    return this.userService.updateRecordLimit(id, recordLimit);
  }
}
