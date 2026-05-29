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
import { WedMapTableService } from './wed-map-table.service';
import { CreateWedMapTableDto } from './dto/create-wed-map-table.dto';
import { UpdateWedMapTableDto } from './dto/update-wed-map-table.dto';
import { AssignParticipantDto } from './dto/assign-participant.dto';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('wedding-map-tables')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wed-map-table')
export class WedMapTableController {
  constructor(private readonly wedMapTableService: WedMapTableService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bàn tiệc mới' })
  create(@Body() createWedMapTableDto: CreateWedMapTableDto) {
    return this.wedMapTableService.create(createWedMapTableDto);
  }

  @Post('assign')
  @ApiOperation({
    summary: 'Gán hoặc giải phóng chỗ ngồi của khách mời vào bàn tiệc',
  })
  assignSeat(@Body() assignParticipantDto: AssignParticipantDto) {
    return this.wedMapTableService.assignSeat(assignParticipantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bàn tiệc (có thể lọc theo wedId)' })
  @ApiQuery({ name: 'wedId', required: false, type: String })
  findAll(@Query('wedId') wedId?: string) {
    return this.wedMapTableService.findAll(wedId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bàn tiệc' })
  findOne(@Param('id') id: string) {
    return this.wedMapTableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bàn tiệc' })
  update(
    @Param('id') id: string,
    @Body() updateWedMapTableDto: UpdateWedMapTableDto,
  ) {
    return this.wedMapTableService.update(id, updateWedMapTableDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa bàn tiệc (Giải phóng tất cả khách mời đang ngồi)',
  })
  remove(@Param('id') id: string) {
    return this.wedMapTableService.remove(id);
  }
}
