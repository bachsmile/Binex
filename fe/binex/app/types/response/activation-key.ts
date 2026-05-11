/** Auto-generated response */
import type { Role } from '../enums/role';

export interface ActivationKey {

  id: string;


  key: string;

  role?: Role;

  days?: number;

  packageId: string;

  serviceId: string;

  isUsed: boolean;

  usedBy: string;

  expiresAt: Date;

  createdAt: Date;

}

