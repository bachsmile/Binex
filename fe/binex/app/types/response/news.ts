/** Auto-generated response */
import type { NewsCategory } from '../enums/news';

export interface News {

  id: string;

  title: string;

  summary: string;

  content: string;

  type: 'enum',
  enum: NewsCategory,
  default: NewsCategory.EVENT,
  category: NewsCategory;

  image: string;

  author: string;

  isFeatured: boolean;

  isAd: boolean;

  createdAt: Date;

  updatedAt: Date;

}

