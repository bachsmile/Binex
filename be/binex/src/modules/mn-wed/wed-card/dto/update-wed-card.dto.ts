import { PartialType } from '@nestjs/mapped-types';
import { CreateWedCardDto } from './create-wed-card.dto';

export class UpdateWedCardDto extends PartialType(CreateWedCardDto) {}
