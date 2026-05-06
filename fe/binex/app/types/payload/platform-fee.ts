/** Auto-generated payload */
import type { FeeType } from '../enums/platform-fee';

export interface UpdatePlatformFeeDto extends Partial<CreatePlatformFeeDto> {

}

export interface CreatePlatformFeeDto {

  code: string;

  name: string;

  description?: string;

  type: FeeType;

  value: number;

  isActive?: boolean;

}

