import { Module } from '@nestjs/common';
import { FiProjectsService } from './fi-projects.service';
import { FiProjectsController } from './fi-projects.controller';

@Module({
  controllers: [FiProjectsController],
  providers: [FiProjectsService],
})
export class FiProjectsModule {}
