import { ApiProperty } from '@nestjs/swagger';
import { ServiceGroup } from '../entities/service-group.entity';

export class ServiceGroupListResponse {
  @ApiProperty({ type: () => [ServiceGroup] })
  data: ServiceGroup[];

  @ApiProperty({ example: 0 })
  total: number;
}
