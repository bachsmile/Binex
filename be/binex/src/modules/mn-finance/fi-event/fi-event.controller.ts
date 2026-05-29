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
import { FiEventService } from './fi-event.service';
import { CreateFiEventDto } from './dto/create-fi-event.dto';
import { UpdateFiEventDto } from './dto/update-fi-event.dto';
import { AddFiEvFeeDto } from './dto/add-fi-ev-fee.dto';
import { AddFiEvTokenDto } from './dto/add-fi-ev-token.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('fi-event')
export class FiEventController {
  constructor(private readonly fiEventService: FiEventService) {}

  @Post()
  create(@Body() createFiEventDto: CreateFiEventDto) {
    return this.fiEventService.create(createFiEventDto);
  }

  @Get()
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Lọc từ ngày',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Lọc tới ngày',
  })
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fiEventService.findAll(startDate, endDate);
  }

  @Get(':id')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Lọc chi tiết từ ngày',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Lọc chi tiết tới ngày',
  })
  findOne(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fiEventService.findOne(+id, startDate, endDate);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiEventDto: UpdateFiEventDto) {
    return this.fiEventService.update(+id, updateFiEventDto);
  }

  @Post(':id/fee')
  addFee(@Param('id') id: string, @Body() addFiEvFeeDto: AddFiEvFeeDto) {
    return this.fiEventService.addFee(+id, addFiEvFeeDto);
  }

  @Get(':id/fees')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Lọc phí từ ngày',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Lọc phí tới ngày',
  })
  getFees(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fiEventService.getFees(+id, startDate, endDate);
  }

  @Post(':id/token')
  addToken(@Param('id') id: string, @Body() addFiEvTokenDto: AddFiEvTokenDto) {
    return this.fiEventService.addToken(+id, addFiEvTokenDto);
  }

  @Get(':id/tokens')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Lọc token từ ngày',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Lọc token tới ngày',
  })
  getTokens(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fiEventService.getTokens(+id, startDate, endDate);
  }

  @Get(':id/points')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Lọc point từ ngày',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Lọc point tới ngày',
  })
  getPoints(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fiEventService.getPoints(+id, startDate, endDate);
  }

  @Get(':id/profit')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Lọc lợi nhuận từ ngày',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Lọc lợi nhuận tới ngày',
  })
  getProfit(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.fiEventService.getProfit(+id, startDate, endDate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiEventService.remove(+id);
  }
}
