import React, { useState } from "react";
import CardRegistrationForm from "../components/payment/CardRegistrationForm";
import CardList from "../components/payment/CardList";
import PurchaseButton from "../components/payment/PurchaseButton";
import type { Card } from "../data/cards";

const PaymentPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const handleRegister = (card: Card) => {
    setCards(prev => [...prev, card]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">카드 결제</h1>

        {/* 카드 시각화 */}
        {cards.length > 0 && (
          <div className="relative w-full h-48 mb-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-inner px-6 py-4">
            <div className="text-lg font-semibold">{cards[cards.length - 1].cardHolder}</div>
            <div className="mt-6 text-xl tracking-widest">{cards[cards.length - 1].cardNumber.replace(/(\d{4})/g, "$1 ")}</div>
            <div className="mt-4 flex justify-between text-sm">
              <span>유효기간: {cards[cards.length - 1].expiry}</span>
              <span>CVC: {cards[cards.length - 1].securityCode}</span>
            </div>
          </div>
        )}

        <CardRegistrationForm onRegister={handleRegister} />

        <div className="mt-6">
          <CardList cards={cards} />
        </div>

        <div className="mt-6">
          <PurchaseButton cards={cards} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
