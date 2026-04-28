import { Module } from '@nestjs/common';
import { WeddingPackageService } from './wedding-package.service';
import { WeddingPackageController } from './wedding-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeddingPackage } from './entities/wedding-package.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WeddingPackage]), AuthModule],
  controllers: [WeddingPackageController],
  providers: [WeddingPackageService],
  exports: [WeddingPackageService],
})
export class WeddingPackageModule {}
