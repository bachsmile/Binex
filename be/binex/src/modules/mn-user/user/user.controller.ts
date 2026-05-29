import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../enum/role.enum';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.userService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết người dùng' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa người dùng' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/packages')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Đăng ký/thêm gói (package) cho người dùng' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        packageId: {
          type: 'string',
          example: '01KSH7GFFJ85QK2WH5EW2N5CN7Z',
          description: 'ID của package muốn thêm cho người dùng',
        },
      },
      required: ['packageId'],
    },
  })
  addPackageToUser(
    @Param('id') userId: string,
    @Body('packageId') packageId: string,
  ) {
    return this.userService.addPackageToUser(userId, packageId);
  }

  @Get(':id/packages')
  @ApiOperation({ summary: 'Lấy danh sách các gói (package) của người dùng' })
  @ApiQuery({
    name: 'includeMicros',
    type: 'boolean',
    required: false,
    description:
      'Có đính kèm danh sách chi tiết các microservice của từng gói hay không',
  })
  findPackagesByUser(
    @Param('id') userId: string,
    @Query('includeMicros') includeMicros?: string,
  ) {
    const shouldInclude = includeMicros === 'true' || includeMicros === '1';
    return this.userService.findPackagesByUser(userId, shouldInclude);
  }

  @Get(':id/microservices')
  @ApiOperation({
    summary:
      'Lấy danh sách các microservice từ các gói đã đăng ký của người dùng',
  })
  findMicroServicesByUser(@Param('id') userId: string) {
    return this.userService.findMicroServicesByUser(userId);
  }
}
