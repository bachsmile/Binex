import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WdCardService } from './wd-card.service';
import { CreateWdCardDto } from '../../dto/card/create-wd-card.dto';
import { UpdateWdCardDto } from '../../dto/card/update-wd-card.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('wd-card')
@ApiBearerAuth('JWT-auth')
@Controller('wd-card')
@UseGuards(AuthGuard)
export class WdCardController {
  constructor(private readonly wdCardService: WdCardService) {}

  @Post()
  create(@Body() createWdCardDto: CreateWdCardDto, @CurrentUser() user: any) {
    return this.wdCardService.create(createWdCardDto, user?.id);
  }

  @Get()
  findAll() {
    return this.wdCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wdCardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWdCardDto: UpdateWdCardDto) {
    return this.wdCardService.update(id, updateWdCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wdCardService.remove(id);
  }
}
