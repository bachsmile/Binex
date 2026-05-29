import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiProjectsService } from './fi-projects.service';
import { CreateFiProjectDto } from './dto/create-fi-project.dto';
import { UpdateFiProjectDto } from './dto/update-fi-project.dto';

@Controller('fi-projects')
export class FiProjectsController {
  constructor(private readonly fiProjectsService: FiProjectsService) {}

  @Post()
  create(@Body() createFiProjectDto: CreateFiProjectDto) {
    return this.fiProjectsService.create(createFiProjectDto);
  }

  @Get()
  findAll() {
    return this.fiProjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiProjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiProjectDto: UpdateFiProjectDto) {
    return this.fiProjectsService.update(+id, updateFiProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiProjectsService.remove(+id);
  }
}
