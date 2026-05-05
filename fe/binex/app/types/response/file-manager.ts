/** Auto-generated response */
import type { User } from './user';

export interface FileAsset {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  url: string;
  userId: string;
  category: string; // 'image', 'video', 'other'
  createdAt: Date;
  user: User;
}

