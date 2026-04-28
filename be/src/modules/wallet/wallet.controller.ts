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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { Role, Roles } from 'src/decorators/roles.decorator';

@ApiTags('wallet')
@ApiBearerAuth('JWT-auth')
@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @CurrentUser() user: any) {
    return this.walletService.create(createWalletDto, user?.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.walletService.findAllByUserId(user?.id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('deposit')
  deposit(@CurrentUser() user: any, @Body() depositDto: DepositDto) {
    return this.walletService.deposit(
      depositDto.address,
      depositDto.amount,
      depositDto.currency,
    );
  }

  @Post('transfer')
  transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    return this.walletService.transfer(
      user?.id,
      transferDto.toAddress,
      transferDto.amount,
      transferDto.currency,
    );
  }

  @Get('create-key')
  createKey() {
    return this.walletService.createKey();
  }

  @Get('validate-private-key')
  validatePrivateKey(@Query('privateKey') privateKey: string) {
    return this.walletService.validatePrivateKey(privateKey);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(id);
  }
}
