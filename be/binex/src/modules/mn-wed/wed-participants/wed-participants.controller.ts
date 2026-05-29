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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { WedParticipantsService } from './wed-participants.service';
import { CreateWedParticipantDto } from './dto/create-wed-participant.dto';
import { UpdateWedParticipantDto } from './dto/update-wed-participant.dto';
import { UpdateGiftMoneyDto } from './dto/update-gift-money.dto';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('wedding-participants')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wed-participants')
export class WedParticipantsController {
  constructor(
    private readonly wedParticipantsService: WedParticipantsService,
  ) {}

  @Get('template')
  @ApiOperation({ summary: 'Tải file Excel mẫu để nhập danh sách khách mời' })
  downloadTemplate(@Res() res: any) {
    const buffer = this.wedParticipantsService.generateTemplate();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=mau_nhap_khach_moi.xlsx',
    );

    return res.end(buffer);
  }

  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'wedId', required: true, type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Nhập danh sách khách mời từ file Excel' })
  importExcel(@UploadedFile() file: any, @Query('wedId') wedId: string) {
    return this.wedParticipantsService.importExcel(file, wedId);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm khách mời mới vào tiệc cưới (Wedding)' })
  create(@Body() createWedParticipantDto: CreateWedParticipantDto) {
    return this.wedParticipantsService.create(createWedParticipantDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả danh sách khách mời (Có thể lọc theo wedId)',
  })
  @ApiQuery({ name: 'wedId', required: false, type: String })
  findAll(@Query('wedId') wedId?: string) {
    return this.wedParticipantsService.findAll(wedId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết khách mời bằng ID' })
  findOne(@Param('id') id: string) {
    return this.wedParticipantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin khách mời' })
  update(
    @Param('id') id: string,
    @Body() updateWedParticipantDto: UpdateWedParticipantDto,
  ) {
    return this.wedParticipantsService.update(id, updateWedParticipantDto);
  }

  @Patch(':id/gift-money')
  @ApiOperation({ summary: 'Cập nhật riêng tiền mừng cưới của khách mời' })
  updateGiftMoney(
    @Param('id') id: string,
    @Body() updateGiftMoneyDto: UpdateGiftMoneyDto,
  ) {
    return this.wedParticipantsService.updateGiftMoney(
      id,
      updateGiftMoneyDto.giftMoney,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa khách mời' })
  remove(@Param('id') id: string) {
    return this.wedParticipantsService.remove(id);
  }
}
