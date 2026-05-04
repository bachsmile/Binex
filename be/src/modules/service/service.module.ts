import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { LimitType } from './entities/limit-type.entity';
import { AuthModule } from '../auth/auth.module';
import { PackageModule } from './features/package/package.module';
import { LimitTypeService } from './limit-type.service';
import { LimitTypeController } from './limit-type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, LimitType]),
    AuthModule,
    PackageModule,
  ],
  controllers: [ServiceController, LimitTypeController],
  providers: [ServiceService, LimitTypeService],
  exports: [ServiceService, LimitTypeService],
})
export class ServiceModule {}
