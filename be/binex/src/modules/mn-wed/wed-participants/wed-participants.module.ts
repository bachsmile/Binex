import { Module } from '@nestjs/common';
import { WedParticipantsService } from './wed-participants.service';
import { WedParticipantsController } from './wed-participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WedParticipant } from './entities/wed-participant.entity';
import { Wed } from '../wed/entities/wed.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WedParticipant, Wed]), AuthModule],
  controllers: [WedParticipantsController],
  providers: [WedParticipantsService],
})
export class WedParticipantsModule {}
