import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { NewsCategory } from '../enums/news-category.enum';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  summary: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(NewsCategory)
  @IsNotEmpty()
  category: NewsCategory;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsBoolean()
  @IsOptional()
  isFeatured: boolean;

  @IsBoolean()
  @IsOptional()
  isAd: boolean;
}
