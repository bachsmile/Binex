import { PartialType } from '@nestjs/mapped-types';
import { CreateWedParticipantDto } from './create-wed-participant.dto';

export class UpdateWedParticipantDto extends PartialType(CreateWedParticipantDto) {}
