import { Injectable } from '@nestjs/common';
import { CreateFiProjectDto } from './dto/create-fi-project.dto';
import { UpdateFiProjectDto } from './dto/update-fi-project.dto';

@Injectable()
export class FiProjectsService {
  create(createFiProjectDto: CreateFiProjectDto) {
    return 'This action adds a new fiProject';
  }

  findAll() {
    return `This action returns all fiProjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiProject`;
  }

  update(id: number, updateFiProjectDto: UpdateFiProjectDto) {
    return `This action updates a #${id} fiProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiProject`;
  }
}
