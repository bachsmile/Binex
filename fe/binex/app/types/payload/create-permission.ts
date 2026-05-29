/** Auto-generated payload */


export interface CreatePermissionDto {

  /**
   * ID của service
   */
  serviceId: string;

  /**
   * Action permission
   * example: user.read
   */
  action: string;

  /**
   * Trọng số quyền: 1=read
   * example: 1
   */
  weight?: number;

}

