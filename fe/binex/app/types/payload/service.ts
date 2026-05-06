/** Auto-generated payload */


export interface UpdateLimitTypeDto extends Partial<CreateLimitTypeDto> {

}

export interface CreateLimitTypeDto {

  example: 'key_limit',
  description: 'Key định danh của loại giới hạn',
  key: string;

  name: string;

  example: 'Số lượng tối đa người dùng có thể tạo',
  description: 'Mô tả chi tiết',
  required: false,
  description?: string;

  example: 'Bản ghi',
  description: 'Đơn vị tính',
  required: false,
  unit?: string;

}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {

}

export interface CreateServiceDto {

  name: string;

  description: string;

  priority: number;

  createdAt?: string;

  updatedAt?: string;

  packageIds?: string[];

}

export interface UpdatePackageRecordLimitDto {

  example: 'wedding',
  key: string;

  example: 10,
  value: number;

}

export interface UpdatePackageDto extends Partial<CreatePackageDto> {

}

export interface CreatePackageDto {

  name: string;

  description: string;

  price: string;

  sale?: number;

  isGroup: boolean;

  amountGroup: number;

  expire: number;

  example: 1024,
  default: 0,
  storageLimit?: number;

  example: { '1'
  description: 'Giới hạn số lượng bản ghi theo loại',
  default: {},
  recordLimit?: object;

  ser: number;

  serviceId: string;

  updatedAt?: Date;

  createdAt?: Date;

}

