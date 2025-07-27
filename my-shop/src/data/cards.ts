export interface Card {
  id: number;

  // 카드 소유자 이름 (예: 홍길동)
  cardHolder: string;

  // 카드 번호 (예: 1234 5678 9012 3456)
  cardNumber: string;

  // 유효기간 (예: 12/26)
  expiry: string;

  // CVC 또는 보안코드 (예: 123)
  securityCode: string;

  // 카드 비밀번호 (선택 입력일 수 있음)
  password?: string;
}