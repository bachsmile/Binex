import { ApiProperty } from '@nestjs/swagger';

export class CreateFiEventDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
