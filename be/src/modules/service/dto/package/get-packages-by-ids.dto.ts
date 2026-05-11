import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class GetPackagesByIdsDto {
  @ApiProperty({ type: [String], example: ['01H...', '01J...'] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
