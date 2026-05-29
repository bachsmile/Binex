/** Auto-generated response */
import type { Role } from '../enums/role';

export interface ActivationKey {

  id: string;


  key: string;

  role?: Role;

  days?: number;

  packageId: string;

  serviceGroupId: string;

  isUsed: boolean;

  usedBy: string;

  expiresAt: Date;

  createdAt: Date;

}

