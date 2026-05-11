/** Auto-generated response */
import type { Wedding } from './wedding';
import type { User } from './user';

export interface WdWeb {

  id: string;


  name: string;

  description: string;

  userId: string;

  status: string;

  price: string;

  expire: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;

  deletedBy: string;

  createdBy: string;

  updatedBy: string;

  isDeleted: boolean;

  wdId: string;

  user: User;

  wedding: Wedding;

}

