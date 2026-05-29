import { Module } from '@nestjs/common';
import { FiReportService } from './fi-report.service';
import { FiReportController } from './fi-report.controller';

@Module({
  controllers: [FiReportController],
  providers: [FiReportService],
})
export class FiReportModule {}
