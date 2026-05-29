import { PartialType } from '@nestjs/mapped-types';
import { CreateFiProjectDto } from './create-fi-project.dto';

export class UpdateFiProjectDto extends PartialType(CreateFiProjectDto) {}
