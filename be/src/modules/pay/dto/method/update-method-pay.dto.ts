import { PartialType } from '@nestjs/swagger';
import { CreateMethodPayDto } from './create-method-pay.dto';

export class UpdateMethodPayDto extends PartialType(CreateMethodPayDto) {}
