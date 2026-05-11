/** Auto-generated response */


export interface ServiceListResponse {

  data: Service[];

  /**
   * example: 0
   */
  total: number;

}

export interface Service {

  id: string;


  name: string;

  description: string;

  packageIds: string[];

  createdAt: Date;

  updatedAt: Date;

  priority: number;

  icon: string;

  thumbnail: string;

}
