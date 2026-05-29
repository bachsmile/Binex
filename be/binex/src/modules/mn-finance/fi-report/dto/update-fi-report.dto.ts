import { PartialType } from '@nestjs/mapped-types';
import { CreateFiReportDto } from './create-fi-report.dto';

export class UpdateFiReportDto extends PartialType(CreateFiReportDto) {}
