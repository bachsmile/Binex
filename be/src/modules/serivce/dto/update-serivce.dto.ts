import { PartialType } from '@nestjs/swagger';

import { CreateSerivceDto } from './create-serivce.dto';

export class UpdateSerivceDto extends PartialType(CreateSerivceDto) {}
