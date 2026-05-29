import { Module } from '@nestjs/common';
import { WedService } from './wed.service';
import { WedController } from './wed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wed } from './entities/wed.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wed]), AuthModule],
  controllers: [WedController],
  providers: [WedService],
})
export class WedModule {}
