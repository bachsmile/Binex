import { PartialType } from '@nestjs/swagger';
import { CreateWdCardDto } from './create-wd-card.dto';

export class UpdateWdCardDto extends PartialType(CreateWdCardDto) {}
