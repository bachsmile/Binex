import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('event')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sự kiện mới' })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventService.create(createEventDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sự kiện của tôi' })
  findAll(@Request() req) {
    return this.eventService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sự kiện' })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sự kiện' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sự kiện' })
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
