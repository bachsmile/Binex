import { PartialType } from '@nestjs/mapped-types';
import { CreateFiCryptoDto } from './create-fi-crypto.dto';

export class UpdateFiCryptoDto extends PartialType(CreateFiCryptoDto) {}
