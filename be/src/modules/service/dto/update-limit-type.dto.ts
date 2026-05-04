import { PartialType } from '@nestjs/swagger';
import { CreateLimitTypeDto } from './create-limit-type.dto';

export class UpdateLimitTypeDto extends PartialType(CreateLimitTypeDto) {}
