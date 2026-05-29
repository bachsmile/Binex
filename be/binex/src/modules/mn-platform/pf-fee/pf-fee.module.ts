import { Module } from '@nestjs/common';
import { PfFeeService } from './pf-fee.service';
import { PfFeeController } from './pf-fee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PfFee } from './entities/pf-fee.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PfFee]), AuthModule],
  controllers: [PfFeeController],
  providers: [PfFeeService],
})
export class PfFeeModule {}
