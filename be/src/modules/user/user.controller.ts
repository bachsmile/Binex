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
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ExtendSubscriptionDto } from './dto/extend-subscription.dto';
import { ChangePackageDto } from './dto/change-package.dto';
import { UpdateUserRecordLimitDto } from './dto/update-record-limit.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';
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

  @Patch(':id/subscriptions')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh sách đăng ký của người dùng' })
  updateSubscriptions(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.userService.updateSubscriptions(id, updateSubscriptionDto);
  }

  @Patch('subscription/:id/extend')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Gia hạn gói dịch vụ của người dùng' })
  @ApiParam({
    name: 'id',
    description: 'ID của gói đăng ký (UserSubscription) cần gia hạn',
  })
  extendSubscription(
    @Param('id') id: string,
    @Body() extendSubscriptionDto: ExtendSubscriptionDto,
  ) {
    return this.userService.extendSubscription(id, extendSubscriptionDto.days);
  }

  @Patch('subscription/:id/change-package')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Đổi gói dịch vụ của người dùng' })
  @ApiParam({
    name: 'id',
    description: 'ID của gói đăng ký (UserSubscription) cần đổi gói',
  })
  changePackage(
    @Param('id') id: string,
    @Body() changePackageDto: ChangePackageDto,
  ) {
    return this.userService.changePackage(id, changePackageDto.newPackageId);
  }

  @Get(':userId/subscriptions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Lấy danh sách gói đăng ký của người dùng' })
  getUserSubscriptions(@Param('userId') userId: string) {
    return this.userService.getUserSubscriptions(userId);
  }

  @Post('clear-except-users')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xoá toàn bộ data bảng trừ bảng user' })
  clearAllExceptUsers() {
    return this.userService.clearAllExceptUsers();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() creator?: any) {
    return this.userService.create(createUserDto, creator?.id);
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
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: UserStatus,
    @Query('role') role?: Role,
  ) {
    return this.userService.findPage(
      Number(page) || 1,
      Number(limit) || 10,
      status,
      role,
    );
  }

  @Get('mine')
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách người dùng do mình quản lý phân trang',
  })
  findMine(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: UserStatus,
    @Query('role') role?: Role,
    @Query('search') search?: string,
  ) {
    return this.userService.findByManager(
      user.id,
      Number(page) || 1,
      Number(limit) || 10,
      status,
      role,
      search,
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
  @ApiOperation({
    summary: 'Gán key và giá trị giới hạn bản ghi cho người dùng',
  })
  updateRecordLimit(
    @Param('id') id: string,
    @Body() data: UpdateUserRecordLimitDto,
  ) {
    return this.userService.updateRecordLimit(id, data.key, data.value);
  }
}
