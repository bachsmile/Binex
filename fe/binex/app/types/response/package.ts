/** Auto-generated response */
import type { Service } from './service';

export interface Package {

  id: string;


  name: string;

  code: string;

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

  services: Service[];

}

