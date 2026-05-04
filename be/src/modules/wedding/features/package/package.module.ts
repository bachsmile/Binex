import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeddingPackage } from '../../entities/wedding-package.entity';
import { WeddingPackageService } from './wedding-package.service';
import { WeddingPackageController } from './wedding-package.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WeddingPackage]), AuthModule],
  controllers: [WeddingPackageController],
  providers: [WeddingPackageService],
  exports: [WeddingPackageService],
})
export class PackageModule {}
