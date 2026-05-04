import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { AuthModule } from '../auth/auth.module';
import { PackageModule } from './features/package/package.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), AuthModule, PackageModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
