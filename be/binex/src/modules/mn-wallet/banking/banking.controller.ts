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
import { BankingService } from './banking.service';
import { CreateBankingDto } from './dto/create-banking.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';

@ApiTags('banking')
@Controller('banking')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
export class BankingController {
  constructor(private readonly bankingService: BankingService) {}

  @Post()
  create(@Body() createBankingDto: CreateBankingDto) {
    return this.bankingService.create(createBankingDto);
  }

  @Get()
  findAll() {
    return this.bankingService.findAll();
  }

  @Get('options')
  @ApiOperation({ summary: 'Lấy danh sách các ngân hàng và ví điện tử hỗ trợ tại Việt Nam' })
  getOptions() {
    return this.bankingService.getOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankingDto: UpdateBankingDto) {
    return this.bankingService.update(updateBankingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankingService.remove(id);
  }
}
