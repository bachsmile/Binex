export enum MethodPayType {
  ACCOUNT_NUMBER = 'account',
  BINEX = 'binex',
  CARD_NUMBER = 'card',
}

export interface MethodPay {
  id: string;
  name: string;
  bankNumber: string;
  cardNumber?: string | null;
  accountHolderName: string;
  bankName: string;
  QRCode?: string | null;
  code: string;
  type: MethodPayType;
  status: string;
  userId?: string | null;
}
