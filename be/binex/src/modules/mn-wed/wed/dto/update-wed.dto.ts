import { PartialType } from '@nestjs/mapped-types';
import { CreateWedDto } from './create-wed.dto';

export class UpdateWedDto extends PartialType(CreateWedDto) {}
