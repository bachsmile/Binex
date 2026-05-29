/** Auto-generated response */
import type { ServiceGroup } from './service-group';

export interface Permission {

  id: number;

  serviceGroupId: string;

  action: string; // user.read, user.create, landing_page.edit;

  weight: number; // 1, 2, 4, 8;

  serviceGroup: ServiceGroup;

  createdAt: Date;

  updatedAt: Date;

}

