/** Auto-generated payload */
import type { NewsCategory } from '../enums/news-category';

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

