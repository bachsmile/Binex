import { PartialType } from '@nestjs/mapped-types';
import { CreateWedMapTableDto } from './create-wed-map-table.dto';

export class UpdateWedMapTableDto extends PartialType(CreateWedMapTableDto) {}
