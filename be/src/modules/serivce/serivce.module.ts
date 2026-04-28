import { Module } from '@nestjs/common';
import { SerivceService } from './serivce.service';
import { SerivceController } from './serivce.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serivce } from './entities/serivce.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Serivce]), AuthModule],
  controllers: [SerivceController],
  providers: [SerivceService],
})
export class SerivceModule {}
