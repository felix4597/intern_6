import React, { useState } from "react";
import CardRegistrationForm from "../components/payment/CardRegistrationForm";
import CardList from "../components/payment/CardList";
import PurchaseButton from "../components/payment/PurchaseButton";
import type { Card } from "../data/cards";
import CryptoJS from "crypto-js";

// 환경에서는 .env 등으로 분리해야 함
const secretKey = "my-secret-key";

// 암호화/복호화 유틸
const encrypt = (text: string): string => CryptoJS.AES.encrypt(text, secretKey).toString();
const decrypt = (ciphertext: string): string =>
  CryptoJS.AES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);

// 카드번호 마스킹: 앞 8자리 비식별 처리
const maskCardNumber = (number: string): string => {
  const decrypted = decrypt(number).replace(/\s/g, "");
  return decrypted.replace(
    /^(.{4})(.{4})(.{4})(.{4})$/,
    (_, _p1, _p2, p3, p4) => `**** **** ${p3} ${p4}`
  );
};

// CVC 마스킹
const maskCVC = (cvc: string): string => {
  const length = decrypt(cvc).length;
  return "*".repeat(length);
};

const PaymentPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRegister = (card: Card) => {
    const encryptedCard: Card = {
      ...card,
      cardNumber: encrypt(card.cardNumber),
      securityCode: encrypt(card.securityCode),
      password: card.password ? encrypt(card.password) : "",
    };
    setCards(prev => [...prev, encryptedCard]);
    setSelectedCardId(encryptedCard.id); // 등록한 카드를 자동 선택
  };

  const selectedCard = cards.find(card => card.id === selectedCardId);

  const handlePurchase = () => {
    if (!selectedCard) {
      alert("결제할 카드를 선택해주세요.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      alert("결제가 완료되었습니다.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">카드 결제</h1>

        {/* 카드 시각화 애니메이션 */}
        {selectedCard && (
          <div className="relative w-full h-56 mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white shadow-2xl px-6 py-5 transform transition-transform duration-300 hover:scale-105">
            <div className="absolute top-4 right-5 text-sm font-bold tracking-widest opacity-80">
              VISA
            </div>

            <div className="mt-10 text-2xl tracking-widest font-mono select-none">
              {maskCardNumber(selectedCard.cardNumber)}
            </div>

            <div className="mt-6 flex justify-between items-end text-xs">
              <div>
                <div className="text-gray-200">CARD HOLDER</div>
                <div className="text-white font-semibold">
                  {selectedCard.cardHolder}
                </div>
              </div>
              <div>
                <div className="text-gray-200">EXPIRES</div>
                <div className="text-white">{selectedCard.expiry}</div>
              </div>
              <div>
                <div className="text-gray-200">CVC</div>
                <div className="text-white">{maskCVC(selectedCard.securityCode)}</div>
              </div>
            </div>
          </div>
        )}

        {/* 카드 등록 입력 폼 */}
        <CardRegistrationForm onRegister={handleRegister} />

        {/* 카드 선택 */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">결제할 카드 선택</label>
          <select
            value={selectedCardId ?? ""}
            onChange={(e) => setSelectedCardId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>카드를 선택하세요</option>
            {cards.map(card => (
              <option key={card.id} value={card.id}>
                {card.cardHolder} - {decrypt(card.cardNumber).slice(-4)}번 카드
              </option>
            ))}
          </select>
        </div>

        {/* 카드 목록 - 클릭 시 선택 */}
        <div className="mt-6">
          <CardList
            cards={cards}
            selectedCardId={selectedCardId}
            onSelectCard={setSelectedCardId}
          />
        </div>

        {/* 결제 버튼 */}
        <div className="mt-6">
          <PurchaseButton
            cards={cards}
            onPurchase={handlePurchase}
            disabled={isProcessing || !selectedCard}
          />
          {isProcessing && (
            <p className="mt-2 text-sm text-gray-500 text-center">결제 처리 중...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
