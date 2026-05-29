import { PartialType } from '@nestjs/mapped-types';
import { CreateFiEarnDto } from './create-fi-earn.dto';

export class UpdateFiEarnDto extends PartialType(CreateFiEarnDto) {}
