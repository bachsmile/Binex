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
import * as express from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('wedding-guest')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wedding-guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm khách mời mới' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @Post('import/:weddingId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
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
  @ApiOperation({ summary: 'Nhập khách mời từ file Excel' })
  importGuests(
    @Param('weddingId') weddingId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.guestService.importGuests(weddingId, file.buffer);
  }

  @Get('template')
  @ApiOperation({ summary: 'Tải file Excel mẫu để nhập khách mời' })
  downloadTemplate(@Res() res: express.Response) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'templates',
      'guest_template.xlsx',
    );
    return res.download(filePath);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách khách mời theo weddingId' })
  findAll(@Query('weddingId') weddingId: string) {
    return this.guestService.findAll(weddingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết khách mời' })
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin khách mời' })
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa khách mời' })
  remove(@Param('id') id: string) {
    return this.guestService.remove(id);
  }
}
