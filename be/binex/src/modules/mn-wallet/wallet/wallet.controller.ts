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
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/modules/mn-user/enum/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { DepositFromAdminDto } from './dto/deposit-from-admin.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateDepositRequestDto } from './dto/create-deposit-request.dto';
import { DepositRequestStatus } from './entities/deposit-request.entity';

@ApiTags('wallet')
@Controller('wallet')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ví' })
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả các ví' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.walletService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Lấy ví admin' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAdminWallets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.walletService.findAdminWallets(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get('key')
  @ApiOperation({ summary: 'Tạo bộ khóa (Private Key)' })
  key() {
    return this.walletService.key();
  }

  @Get('Balance')
  @ApiOperation({ summary: 'Kiểm tra số dư' })
  getBalance(@Query('address') address: string) {
    return this.walletService.getBalance(address);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy ví theo userId' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findWalletsByUserId(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.walletService.findWalletsByUserId(
      userId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Post('validate-private-key')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        privateKey: {
          type: 'string',
          example:
            'abandon ability able about above absent absorb abstract absurd abuse access accident',
          description: 'Chuỗi 12 từ khóa khôi phục ví',
        },
      },
      required: ['privateKey'],
    },
  })
  @ApiOperation({ summary: 'Kiểm tra Private Key' })
  validatePrivateKey(@Body('privateKey') privateKey: string) {
    return this.walletService.validatePrivateKey(privateKey);
  }

  @Get('cb-wallet-admin')
  @ApiOperation({ summary: 'Lấy danh sách tùy chọn ví Admin cho Combobox' })
  getAdminWalletOptions() {
    return this.walletService.getAdminWalletOptions();
  }

  @Get(':address')
  @ApiOperation({ summary: 'Lấy ví theo địa chỉ' })
  findOne(@Param('address') address: string) {
    return this.walletService.findOne(address);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật ví' })
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('deposit')
  @ApiOperation({ summary: 'Nạp tiền vào ví (Admin)' })
  depositAdmin(@Body() depositDto: DepositDto) {
    return this.walletService.depositAdmin(depositDto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Thanh toán / Chuyển tiền giữa các ví' })
  transfer(@Body() transferDto: TransferDto) {
    return this.walletService.transfer(transferDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('deposit-from-admin')
  @ApiOperation({
    summary: 'Nạp tiền vào ví từ ví Admin hệ thống (Bảo mật cao)',
  })
  depositFromAdmin(@Body() depositFromAdminDto: DepositFromAdminDto) {
    return this.walletService.depositFromAdminWallet(depositFromAdminDto);
  }

  @Post('deposit-request')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Gửi yêu cầu nạp tiền (Người dùng)' })
  createDepositRequest(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateDepositRequestDto,
  ) {
    return this.walletService.createDepositRequest(userId, dto);
  }

  @Get('deposit-requests')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu nạp tiền (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: DepositRequestStatus })
  getDepositRequests(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: DepositRequestStatus,
  ) {
    return this.walletService.getDepositRequests(
      Number(page) || 1,
      Number(limit) || 10,
      status,
    );
  }

  @Post('deposit-request/:id/approve')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Duyệt đơn nạp tiền của người dùng (Admin)' })
  approveDepositRequest(@Param('id') id: string) {
    return this.walletService.approveDepositRequest(id);
  }

  @Post('deposit-request/:id/reject')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Từ chối đơn nạp tiền của người dùng (Admin)' })
  rejectDepositRequest(@Param('id') id: string) {
    return this.walletService.rejectDepositRequest(id);
  }
}
