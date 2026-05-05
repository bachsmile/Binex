/** Auto-generated payload */


export interface UpdateLimitTypeDto {

}

export interface CreateLimitTypeDto {
  key: string;
  name: string;
  description?: string;
  unit?: string;
}

export interface UpdateServiceDto {

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
  key: string;
  value: number;
}

export interface UpdatePackageDto {

}

export interface CreatePackageDto {
  name: string;
  description: string;
  price: string;
  sale?: number;
  isGroup: boolean;
  amountGroup: number;
  expire: number;
  default: 0,
  storageLimit?: number;
  recordLimit?: object;
  ser: number;
  serviceId: string;
  updatedAt: Date;
  createdAt: Date;
}

