import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MethodPayService } from './method-pay.service';
import { CreateMethodPayDto } from '../../dto/method/create-method-pay.dto';
import { UpdateMethodPayDto } from '../../dto/method/update-method-pay.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';

@ApiTags('method-pay')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('method-pay')
export class MethodPayController {
  constructor(private readonly methodPayService: MethodPayService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Tạo phương thức thanh toán mới' })
  create(@Body() createMethodPayDto: CreateMethodPayDto) {
    return this.methodPayService.create(createMethodPayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả phương thức thanh toán' })
  findAll() {
    return this.methodPayService.findAll();
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
