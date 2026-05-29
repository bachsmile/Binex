/** Auto-generated payload */
import type { Wedding } from '../response/wedding';

export interface CreateServiceGroupDto {

  /**
   * example: Wedding
   */
  name: string;

  /**
   * example: WEDDING
   */
  code?: string;

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

  /**
   * example: https://example.com/thumbnail.png
   */
  thumbnail?: string;

  /**
   * example: active
   */
  status?: string;

}

