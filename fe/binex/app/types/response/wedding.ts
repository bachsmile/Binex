/** Auto-generated response */
import type { WdWeb } from './wd-web';
import type { WdCard } from './wd-card';
import type { Guest } from './guest';
import type { User } from './user';

export interface Wedding {

  id: string;


  name: string;

  description: string;

  groomName: string;

  groomPhone: string;

  fatherGroomName: string;

  motherGroomName: string;

  brideName: string;

  bridePhone: string;

  fatherBrideName: string;

  motherBrideName: string;

  weddingDate: Date;

  inviteDate: Date;

  ceremonyTime: string;

  venueName: string;

  venueAddress: string;

  inviteAddress: string;

  userId: string;

  status: string;

  qrCode: string;

  budget: number;

  guestCount: number;

  expireDays: number;

  note: string;

  images: string[];

  videos: string[];

  webId: string;

  cardId: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;

  createdBy: string;

  updatedBy: string;

  autoSend: boolean;

  isDeleted: boolean;

  user: User;

  wdWeb: WdWeb;

  wdCard: WdCard;

  guests: Guest[];

}

