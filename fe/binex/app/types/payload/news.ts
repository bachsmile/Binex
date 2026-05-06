/** Auto-generated payload */
import type { NewsCategory } from '../enums/news';

export interface UpdateNewsDto extends Partial<CreateNewsDto> {

}

export interface GetNewsQueryDto {

  page?: number;

  limit?: number;

  category?: string;

  isFeatured?: string;

  isAd?: string;

}

export interface CreateNewsDto {

  title: string;

  summary?: string;

  content: string;

  category: NewsCategory;

  image?: string;

  author?: string;

  isFeatured?: boolean;

  isAd?: boolean;

}

