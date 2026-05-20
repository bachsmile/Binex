/** Auto-generated payload */
import type { Wedding } from '../response/wedding';

export interface CreateServiceDto {

  /**
   * example: Wedding
   */
  name: string;

  /**
   * example: Wedding services including cards and web
   */
  description: string;

  /**
   * example: 1
   */
  priority: number;

  /**
   * example: ph:briefcase-duotone
   */
  icon?: string;

  /**
   * example: 2026-04-29T00:00:00Z
   */
  createdAt?: string;

  /**
   * example: 2026-04-29T00:00:00Z
   */
  updatedAt?: string;

  packageIds?: string[];

  /**
   * example: https://example.com/thumbnail.png
   */
  thumbnail?: string;

}

