import { PartialType } from '@nestjs/mapped-types';
import { CreateFiMoneyDto } from './create-fi-money.dto';

export class UpdateFiMoneyDto extends PartialType(CreateFiMoneyDto) {}
