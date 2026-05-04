import { PartialType } from '@nestjs/swagger';
import { CreateWeddingPackageDto } from './create-wedding-package.dto';

export class UpdateWeddingPackageDto extends PartialType(CreateWeddingPackageDto) {}
