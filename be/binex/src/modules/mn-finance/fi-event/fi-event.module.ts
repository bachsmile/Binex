import { Module } from '@nestjs/common';
import { FiEventService } from './fi-event.service';
import { FiEventController } from './fi-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiEvent } from './entities/fi-event.entity';
import { FiEvFee } from './entities/fi-ev-fee.entity';
import { FiEvToken } from './entities/fi-ev-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FiEvent, FiEvFee, FiEvToken])],
  controllers: [FiEventController],
  providers: [FiEventService],
  exports: [FiEventService],
})
export class FiEventModule {}
