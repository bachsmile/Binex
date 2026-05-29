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
import { WedCardService } from './wed-card.service';
import { CreateWedCardDto } from './dto/create-wed-card.dto';
import { UpdateWedCardDto } from './dto/update-wed-card.dto';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('wedding-card')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wed-card')
export class WedCardController {
  constructor(private readonly wedCardService: WedCardService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thiệp cưới mới cho tiệc cưới (Wedding)' })
  create(@Body() createWedCardDto: CreateWedCardDto) {
    return this.wedCardService.create(createWedCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh sách thiệp cưới' })
  findAll() {
    return this.wedCardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết thiệp cưới bằng ID' })
  findOne(@Param('id') id: string) {
    return this.wedCardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin thiệp cưới' })
  update(@Param('id') id: string, @Body() updateWedCardDto: UpdateWedCardDto) {
    return this.wedCardService.update(id, updateWedCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thiệp cưới' })
  remove(@Param('id') id: string) {
    return this.wedCardService.remove(id);
  }
}
