import { Module } from '@nestjs/common';
import { ServiceGroupService } from './service-group.service';
import { ServiceGroupController } from './service-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceGroup } from './entities/service-group.entity';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceGroup]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ServiceGroupController],
  providers: [ServiceGroupService],
  exports: [ServiceGroupService, TypeOrmModule],
})
export class ServiceGroupModule {}
