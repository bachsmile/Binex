import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../entities/service.entity';

export class ServiceListResponse {
  @ApiProperty({ type: () => [Service] })
  data: Service[];

  @ApiProperty({ example: 0 })
  total: number;
}
