import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MethodPayService } from './method-pay.service';
import { CreateMethodPayDto } from '../../dto/method/create-method-pay.dto';
import { UpdateMethodPayDto } from '../../dto/method/update-method-pay.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@ApiTags('method-pay')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('method-pay')
export class MethodPayController {
  constructor(private readonly methodPayService: MethodPayService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phương thức thanh toán mới' })
  create(
    @Body() createMethodPayDto: CreateMethodPayDto,
    @CurrentUser() user: User,
  ) {
    const targetUserId =
      (user?.role === Role.SUPER_ADMIN || user?.role === Role.ADMIN) &&
      createMethodPayDto.userId
        ? createMethodPayDto.userId
        : user?.id;
    return this.methodPayService.create(createMethodPayDto, targetUserId);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Lấy danh sách phương thức thanh toán của cá nhân' })
  findMine(@CurrentUser() user: User) {
    return this.methodPayService.findMine(user.id);
  }

  @Get('system')
  @ApiOperation({
    summary: 'Lấy danh sách phương thức thanh toán của hệ thống Binex',
  })
  findSystem() {
    return this.methodPayService.findSystem();
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách tất cả phương thức thanh toán' })
  findAll(@Query('userId') userId?: string) {
    return this.methodPayService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một phương thức thanh toán' })
  findOne(@Param('id') id: string) {
    return this.methodPayService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật phương thức thanh toán' })
  update(
    @Param('id') id: string,
    @Body() updateMethodPayDto: UpdateMethodPayDto,
  ) {
    return this.methodPayService.update(id, updateMethodPayDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Xóa phương thức thanh toán' })
  remove(@Param('id') id: string) {
    return this.methodPayService.remove(id);
  }
}
