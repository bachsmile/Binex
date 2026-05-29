import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';

@ApiTags('transaction')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả lịch sử giao dịch' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.transactionService.findAll(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('mine')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch cá nhân hoặc theo user id' })
  findMine(
    @CurrentUser() user: any,
    @Query('id') id?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const requestedUserId = id || userId;
    const canViewOtherUser =
      user?.role === Role.SUPER_ADMIN || user?.role === Role.ADMIN;
    const targetUserId =
      requestedUserId && canViewOtherUser ? requestedUserId : user?.id;

    return this.transactionService.findAllByUserId(
      targetUserId,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('address/:address')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch theo địa chỉ ví' })
  findByAddress(@Param('address') address: string) {
    return this.transactionService.findAllByAddress(address);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết giao dịch' })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}
