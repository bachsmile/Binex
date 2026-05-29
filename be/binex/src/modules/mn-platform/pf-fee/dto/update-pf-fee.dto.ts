import { PartialType } from '@nestjs/mapped-types';
import { CreatePfFeeDto } from './create-pf-fee.dto';

export class UpdatePfFeeDto extends PartialType(CreatePfFeeDto) {}
