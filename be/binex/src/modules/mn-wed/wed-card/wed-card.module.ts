import { Module } from '@nestjs/common';
import { WedCardService } from './wed-card.service';
import { WedCardController } from './wed-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WedCard } from './entities/wed-card.entity';
import { Wed } from '../wed/entities/wed.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WedCard, Wed]), AuthModule],
  controllers: [WedCardController],
  providers: [WedCardService],
})
export class WedCardModule {}
