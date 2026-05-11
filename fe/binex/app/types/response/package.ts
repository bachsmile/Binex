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

  storageLimit: number; // Dung lượng tối đa (MB), 0 là không giới hạn;

  recordLimit: any; // Giới hạn bản ghi theo từng loại { "key";

  createdAt: Date;

  updatedAt: Date;

  serviceId: string;

  ser: number;

}

