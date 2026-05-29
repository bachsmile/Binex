import { Module } from '@nestjs/common';
import { WedWebService } from './wed-web.service';
import { WedWebController } from './wed-web.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WedWeb } from './entities/wed-web.entity';
import { Wed } from '../wed/entities/wed.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WedWeb, Wed]), AuthModule],
  controllers: [WedWebController],
  providers: [WedWebService],
})
export class WedWebModule {}
