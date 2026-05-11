/** Auto-generated response */
import type { NewsCategory } from '../enums/news-category';

export interface News {

  id: string;

  title: string;

  summary: string;

  content: string;

  category: NewsCategory;

  image: string;

  author: string;

  isFeatured: boolean;

  isAd: boolean;

  createdAt: Date;

  updatedAt: Date;

}

