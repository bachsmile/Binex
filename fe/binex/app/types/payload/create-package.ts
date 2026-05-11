/** Auto-generated payload */


export interface CreatePackageDto {

  name: string;

  description: string;

  price: string;

  sale?: number;

  isGroup: boolean;

  amountGroup: number;

  expire: number;

  /**
   * example: 1024
   * Giới hạn dung lượng (MB)
   */
  storageLimit?: number;

  /**
   * example: { '1': 10
   * Giới hạn số lượng bản ghi theo loại
   */
  recordLimit?: object;

  ser: number;

  serviceId: string;

  updatedAt?: Date;

  createdAt?: Date;

}

