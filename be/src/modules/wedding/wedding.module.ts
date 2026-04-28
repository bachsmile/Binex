import { Module } from '@nestjs/common';
import { WeddingService } from './wedding.service';
import { WeddingController } from './wedding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wedding } from './entities/wedding.entity';
import { WdWeb } from './entities/wd-web.entity';
import { WdCard } from './entities/wd-card.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wedding, WdWeb, WdCard]), AuthModule],
  controllers: [WeddingController],
  providers: [WeddingService],
})
export class WeddingModule {}
