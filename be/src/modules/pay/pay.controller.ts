import { Controller } from '@nestjs/common';
import { PayService } from './pay.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pay')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}
}
