export interface Card {
  id: number;
  number: string;       // 마스킹된 카드 번호
  expiry: string;
  holder: string;
  securityCode: string;
  password: string;
}