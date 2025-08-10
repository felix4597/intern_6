import React, { useEffect, useMemo, useState, useCallback } from "react";
import CardRegistrationForm from "../components/payment/CardRegistrationForm";
import CardList from "../components/payment/CardList";
import PurchaseButton from "../components/payment/PurchaseButton";
import type { Card } from "../data/cards";
import CryptoJS from "crypto-js";

/**
 * 마스킹/파생 필드 방식
 * - 등록 시 평문으로 파생값(last4, maskedNumber, cvcLength) 생성
 * - 저장 시 민감정보(번호, CVC, 비밀번호 앞 2자리)는 암호화
 * - 화면 표시는 파생 필드만 사용(복호화 X)
 */

const STORAGE_KEY = "payment_cards";
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "dev-only-key"; // Vite 방식

// --- 암호화 유틸 (복호화는 사용하지 않음) ---
const encrypt = (text: string): string =>
  CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

// --- 파생값 유틸 ---
const onlyDigits = (v: string) => v.replace(/\D/g, "");
const deriveMaskedNumber = (plain16digits: string): string => {
  // "**** **** p3 p4"
  const d = plain16digits;
  if (d.length !== 16) return "**** **** **** ****";
  const p3 = d.slice(8, 12);
  const p4 = d.slice(12, 16);
  return `**** **** ${p3} ${p4}`;
};
const deriveLast4 = (plainDigits: string) => plainDigits.slice(-4);
const deriveCVCLength = (cvc: string) => onlyDigits(cvc).length;

// --- 저장용 타입(암호문 + 파생값 포함) ---
interface StoredCard extends Card {
  cardNumber: string;   // encrypted
  securityCode: string; // encrypted
  password?: string;    // encrypted (앞 2자리 입력만 받는 전제)
  last4: string;        // derived
  maskedNumber: string; // derived
  cvcLength: number;    // derived
}

const PaymentPage: React.FC = () => {
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 로컬 스토리지 로드/저장 ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredCard[];
      if (Array.isArray(parsed)) {
        setCards(parsed);
        if (parsed.length > 0) setSelectedCardId(parsed[parsed.length - 1].id);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {
      // ignore
    }
  }, [cards]);

  // --- 카드 등록: 파생값 생성 + 암호화 저장 ---
  const handleRegister = useCallback((card: Card) => {
    const digits = onlyDigits(card.cardNumber);
    const last4 = deriveLast4(digits);
    const maskedNumber = deriveMaskedNumber(digits);
    const cvcLength = deriveCVCLength(card.securityCode);

    const stored: StoredCard = {
      ...card,
      cardNumber: encrypt(digits),
      securityCode: encrypt(card.securityCode),
      password: card.password ? encrypt(card.password) : "",
      last4,
      maskedNumber,
      cvcLength,
    };

    setCards(prev => [...prev, stored]);
    setSelectedCardId(card.id);
  }, []);

  const selectedCard = useMemo(
    () => cards.find(c => c.id === selectedCardId) || null,
    [cards, selectedCardId]
  );

  // --- 결제 처리 (데모) ---
  const handlePurchase = useCallback(() => {
    if (!selectedCard) {
      alert("결제할 카드를 선택해주세요.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("결제가 완료되었습니다.");
    }, 1500);
  }, [selectedCard]);

  // --- 라벨(복호화 없이 파생값만) ---
  const cardLabel = (c: StoredCard) => `${c.cardHolder} •••• ${c.last4}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">카드 결제</h1>

        {/* 카드 미리보기(마스킹/파생 필드만 사용) */}
        {selectedCard && (
          <div className="relative w-full h-56 mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white shadow-2xl px-6 py-5 transform transition-transform duration-300 hover:scale-105">
            <div className="absolute top-4 right-5 text-sm font-bold tracking-widest opacity-80">
              VISA
            </div>

            <div className="mt-10 text-2xl tracking-widest font-mono select-none">
              {selectedCard.maskedNumber}
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
                <div className="text-white">{"*".repeat(selectedCard.cvcLength)}</div>
              </div>
            </div>
          </div>
        )}

        {/* 카드 등록 입력 폼 (평문 → 파생+암호화 저장) */}
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
                {cardLabel(card)}
              </option>
            ))}
          </select>
        </div>

        {/* 카드 목록(클릭 시 선택) */}
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

        {!import.meta.env.VITE_CRYPTO_KEY && (
          <p className="mt-4 text-xs text-red-500">
            경고: VITE_CRYPTO_KEY가 설정되지 않았습니다. 개발/테스트 환경에서만 사용하세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
