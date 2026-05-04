import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformFee } from './entities/platform-fee.entity';
import { PlatformFeeService } from './platform-fee.service';
import { PlatformFeeController } from './platform-fee.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformFee]), AuthModule],
  controllers: [PlatformFeeController],
  providers: [PlatformFeeService],
  exports: [PlatformFeeService],
})
export class PlatformFeeModule {}
