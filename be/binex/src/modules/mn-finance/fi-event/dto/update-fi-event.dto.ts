import { PartialType } from '@nestjs/mapped-types';
import { CreateFiEventDto } from './create-fi-event.dto';

export class UpdateFiEventDto extends PartialType(CreateFiEventDto) {}
