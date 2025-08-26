import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import CardRegistrationForm from "../components/payment/CardRegistrationForm";
import CardList from "../components/payment/CardList";
import PurchaseButton from "../components/payment/PurchaseButton";
import type { Card } from "../data/cards";
import CryptoJS from "crypto-js";

const STORAGE_KEY = "payment_cards";
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "dev-only-key";

// 주문/카트 저장 키
const ORDER_KEY = "last_order";
const CART_KEY = "cartItems";

function createOrderFromCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;
    const items = JSON.parse(raw) as { product: { id: number; price: number }, quantity: number }[];
    const order = {
      id: "ORD-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
      items: items.map(it => ({ productId: it.product.id, quantity: it.quantity, price: it.product.price })),
      total: items.reduce((sum, it) => sum + it.product.price * it.quantity, 0),
      createdAt: new Date().toISOString(),
    };
    return order;
  } catch { return null; }
}

// 암호화 유틸
const encrypt = (text: string): string => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
const onlyDigits = (v: string) => v.replace(/\D/g, "");
const deriveMaskedNumber = (d: string) => d.length === 16 ? `**** **** ${d.slice(8,12)} ${d.slice(12,16)}` : "**** **** **** ****";
const deriveLast4 = (d: string) => d.slice(-4);
const deriveCVCLength = (cvc: string) => onlyDigits(cvc).length;

interface StoredCard extends Card {
  cardNumber: string;
  securityCode: string;
  password?: string;
  last4: string;
  maskedNumber: string;
  cvcLength: number;
}

const PaymentPage: React.FC = () => {
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredCard[];
      if (Array.isArray(parsed)) {
        setCards(parsed);
        if (parsed.length > 0) setSelectedCardId(parsed[parsed.length - 1].id);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  const handleRegister = useCallback((card: Card) => {
    const digits = onlyDigits(card.cardNumber);
    const stored: StoredCard = {
      ...card,
      cardNumber: encrypt(digits),
      securityCode: encrypt(card.securityCode),
      password: card.password ? encrypt(card.password) : "",
      last4: deriveLast4(digits),
      maskedNumber: deriveMaskedNumber(digits),
      cvcLength: deriveCVCLength(card.securityCode),
    };
    setCards(prev => [...prev, stored]);
    setSelectedCardId(card.id);
  }, []);

  const selectedCard = useMemo(() => cards.find(c => c.id === selectedCardId) || null, [cards, selectedCardId]);

  // ✅ 결제 처리 → 주문 생성 후 Success 페이지 이동
  const handlePurchase = useCallback(() => {
    if (!selectedCard) {
      alert("결제할 카드를 선택해주세요.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const order = createOrderFromCart();
      if (order) {
        try {
          localStorage.setItem(ORDER_KEY, JSON.stringify(order));
          localStorage.setItem(CART_KEY, JSON.stringify([]));
        } catch {}
        navigate("/payment/success");
      } else {
        alert("결제할 상품이 없습니다.");
      }
    }, 1500);
  }, [selectedCard, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">카드 결제</h1>

        {selectedCard && (
          <div className="relative w-full h-56 mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white shadow-2xl px-6 py-5">
            <div className="mt-10 text-2xl tracking-widest font-mono">{selectedCard.maskedNumber}</div>
            <div className="mt-6 flex justify-between text-xs">
              <div><div>CARD HOLDER</div><div>{selectedCard.cardHolder}</div></div>
              <div><div>EXPIRES</div><div>{selectedCard.expiry}</div></div>
              <div><div>CVC</div><div>{"*".repeat(selectedCard.cvcLength)}</div></div>
            </div>
          </div>
        )}

        <CardRegistrationForm onRegister={handleRegister} />

        <div className="mt-6">
          <label className="block text-sm mb-2">결제할 카드 선택</label>
          <select value={selectedCardId ?? ""} onChange={(e) => setSelectedCardId(Number(e.target.value))} className="w-full p-2 border rounded">
            <option value="" disabled>카드를 선택하세요</option>
            {cards.map(card => (
              <option key={card.id} value={card.id}>{card.cardHolder} •••• {card.last4}</option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <CardList cards={cards} selectedCardId={selectedCardId} onSelectCard={setSelectedCardId} />
        </div>

        <div className="mt-6">
          <PurchaseButton cards={cards} onPurchase={handlePurchase} disabled={isProcessing || !selectedCard} />
          {isProcessing && <p className="mt-2 text-sm text-gray-500 text-center">결제 처리 중...</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
