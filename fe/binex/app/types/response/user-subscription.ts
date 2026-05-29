/** Auto-generated response */
import type { User } from './user';
import type { ServiceGroup } from './service-group';
import type { Package } from './package';

export interface UserSubscription {

  id: string;


  packId: string;

  package: Package;

  serviceGroupId: string;

  serviceGroup: ServiceGroup;

  ac: number;

  userId: string;

  user: User;

  expiredAt: Date;

  createdAt: Date;

  updatedAt: Date;

}

