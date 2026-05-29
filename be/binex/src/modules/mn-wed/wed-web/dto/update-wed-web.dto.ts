import { PartialType } from '@nestjs/mapped-types';
import { CreateWedWebDto } from './create-wed-web.dto';

export class UpdateWedWebDto extends PartialType(CreateWedWebDto) {}
