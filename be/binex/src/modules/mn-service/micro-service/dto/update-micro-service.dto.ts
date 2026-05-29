import { PartialType } from '@nestjs/mapped-types';
import { CreateMicroServiceDto } from './create-micro-service.dto';

export class UpdateMicroServiceDto extends PartialType(CreateMicroServiceDto) {}
