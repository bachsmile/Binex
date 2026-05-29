import { Module } from '@nestjs/common';
import { WedMapTableService } from './wed-map-table.service';
import { WedMapTableController } from './wed-map-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WedMapTable } from './entities/wed-map-table.entity';
import { WedParticipant } from '../wed-participants/entities/wed-participant.entity';
import { Wed } from '../wed/entities/wed.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WedMapTable, WedParticipant, Wed]),
    AuthModule,
  ],
  controllers: [WedMapTableController],
  providers: [WedMapTableService],
  exports: [WedMapTableService],
})
export class WedMapTableModule {}
