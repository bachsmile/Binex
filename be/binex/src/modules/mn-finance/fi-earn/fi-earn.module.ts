import { Module } from '@nestjs/common';
import { FiEarnService } from './fi-earn.service';
import { FiEarnController } from './fi-earn.controller';

@Module({
  controllers: [FiEarnController],
  providers: [FiEarnService],
})
export class FiEarnModule {}
