/** Auto-generated response */


export interface Package {

  id: string;


  name: string;

  description: string;

  price: string;

  isGroup: boolean;

  amountGroup: number;

  sale?: number;

  expire: number;


  recordLimit: any; // Giới hạn bản ghi theo từng loại { "key"

  createdAt: Date;

  updatedAt: Date;

  serviceId: string;

  ser: number;

}

export interface LimitType {

  id: number;



  description: string;


  createdAt: Date;

}

