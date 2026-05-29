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
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WalletResponse, WalletListResponse, WalletActionResponse, AdminWalletResponse } from './responses/wallet.response';
import { Wallet } from './entities/wallet.entity';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('wallet')
@ApiBearerAuth('JWT-auth')
@Controller('wallet')
@UseGuards(AuthGuard, RolesGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ví mới' })
  @ApiResponse({ status: 201, type: Wallet })
  create(@Body() createWalletDto: CreateWalletDto, @CurrentUser() user: any) {
    const canCreateForOtherUser =
      user?.role === Role.SUPER_ADMIN || user?.role === Role.ADMIN;
    const targetUserId =
      createWalletDto.userId && canCreateForOtherUser
        ? createWalletDto.userId
        : user?.id;

    return this.walletService.create(createWalletDto, targetUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả ví trong hệ thống' })
  @ApiResponse({ status: 200, type: WalletListResponse })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.walletService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Lấy danh sách ví cá nhân của người dùng hiện tại' })
  @ApiResponse({ status: 200, type: WalletListResponse })
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

    return this.walletService.findAllByUserId(
      targetUserId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('admin')
  @ApiOperation({ summary: 'Lấy danh sách ví admin' })
  @ApiResponse({ status: 200, type: WalletListResponse })
  findAdminWallets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.walletService.findAllAdmin(
      Number(page) || 1,
      Number(limit) || 100,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('deposit')
  @ApiOperation({ summary: 'Nạp tiền vào ví (Admin)' })
  @ApiResponse({ status: 200, type: WalletActionResponse })
  deposit(@CurrentUser() user: any, @Body() depositDto: DepositDto) {
    return this.walletService.deposit(
      depositDto.address,
      depositDto.amount,
      depositDto.currency,
      depositDto.methodPayId,
      depositDto.description,
      user?.id,
    );
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Chuyển tiền giữa các ví' })
  @ApiResponse({ status: 200, type: WalletActionResponse })
  transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    const canUseAnyFromWallet =
      user?.role === Role.SUPER_ADMIN || user?.role === Role.ADMIN;

    return this.walletService.transfer(
      transferDto.from,
      transferDto.to,
      transferDto.amount,
      transferDto.currency,
      user?.id,
      canUseAnyFromWallet,
    );
  }

  @Get('create-key')
  @ApiOperation({ summary: 'Tạo bộ khóa (Private Key)' })
  @ApiResponse({ status: 200, schema: { properties: { privateKey: { type: 'string' } } } })
  createKey() {
    return this.walletService.createKey();
  }

  @Get('validate-private-key')
  @ApiOperation({ summary: 'Kiểm tra Private Key' })
  @ApiResponse({ status: 200, type: String })
  validatePrivateKey(@Query('privateKey') privateKey: string) {
    return this.walletService.validatePrivateKey(privateKey);
  }

  @Get('admin-wallet')
  @ApiOperation({ summary: 'Lấy địa chỉ ví Super Admin để nhận thanh toán' })
  @ApiResponse({ status: 200, type: AdminWalletResponse })
  async getAdminWallet() {
    const address = await this.walletService.getAdminWallet();
    return { address };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết ví theo ID' })
  @ApiResponse({ status: 200, type: Wallet })
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật ví' })
  @ApiResponse({ status: 200, type: Wallet })
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa ví' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.walletService.remove(id);
  }
}
