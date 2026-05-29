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
import { WedService } from './wed.service';
import { CreateWedDto } from './dto/create-wed.dto';
import { UpdateWedDto } from './dto/update-wed.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('wedding')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wed')
export class WedController {
  constructor(private readonly wedService: WedService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tiệc cưới mới' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createWedDto: CreateWedDto,
  ) {
    return this.wedService.create(createWedDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả tiệc cưới của người dùng hiện tại' })
  findAll(@CurrentUser('id') userId: string) {
    return this.wedService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết tiệc cưới bằng ID' })
  findOne(@Param('id') id: string) {
    return this.wedService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin tiệc cưới' })
  update(@Param('id') id: string, @Body() updateWedDto: UpdateWedDto) {
    return this.wedService.update(id, updateWedDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tiệc cưới (Soft delete)' })
  remove(@Param('id') id: string) {
    return this.wedService.remove(id);
  }
}
