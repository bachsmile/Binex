import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from '../../entities/package.entity';
import { AuthModule } from '../../../auth/auth.module';
import { Service } from '../../entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Service]), AuthModule],
  controllers: [PackageController],
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
