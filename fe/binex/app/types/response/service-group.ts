/** Auto-generated response */
import type { Permission } from './permission';

export interface ServiceGroupListResponse {

  data: ServiceGroup[];

  /**
   * example: 0
   */
  total: number;

}

export interface ServiceGroup {

  id: string;


  name: string;

  code: string;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  priority: number;

  icon: string;

  thumbnail: string;

  status: string;

  permissions: Permission[];

}

