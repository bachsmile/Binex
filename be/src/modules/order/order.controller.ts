import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Order, PaymentStatus } from './entities/order.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ status: 201, type: Order })
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.orderService.create(createOrderDto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng của người dùng hiện tại' })
  @ApiResponse({ status: 200, type: [Order] })
  findAll(@CurrentUser() user: any) {
    return this.orderService.findAll(user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết đơn hàng theo ID' })
  @ApiResponse({ status: 200, type: Order })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái thanh toán đơn hàng' })
  @ApiResponse({ status: 200, type: Order })
  updateStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: PaymentStatus,
    @Body('transactionId') transactionId?: string,
  ) {
    return this.orderService.updatePaymentStatus(id, paymentStatus, transactionId);
  }
}
