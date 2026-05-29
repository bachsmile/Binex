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
import { WedWebService } from './wed-web.service';
import { CreateWedWebDto } from './dto/create-wed-web.dto';
import { UpdateWedWebDto } from './dto/update-wed-web.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('wedding-web')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wed-web')
export class WedWebController {
  constructor(private readonly wedWebService: WedWebService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo website mới cho tiệc cưới (Wedding)' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createWedWebDto: CreateWedWebDto,
  ) {
    return this.wedWebService.create(createWedWebDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh sách website tiệc cưới' })
  findAll() {
    return this.wedWebService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết website tiệc cưới bằng ID' })
  findOne(@Param('id') id: string) {
    return this.wedWebService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật website tiệc cưới' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateWedWebDto: UpdateWedWebDto,
  ) {
    return this.wedWebService.update(id, updateWedWebDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa website tiệc cưới' })
  remove(@Param('id') id: string) {
    return this.wedWebService.remove(id);
  }
}
