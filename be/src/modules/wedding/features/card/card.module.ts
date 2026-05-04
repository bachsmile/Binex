import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WdCard } from '../../entities/wd-card.entity';
import { WdCardService } from './wd-card.service';
import { WdCardController } from './wd-card.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WdCard]), AuthModule],
  controllers: [WdCardController],
  providers: [WdCardService],
  exports: [WdCardService],
})
export class CardModule {}
