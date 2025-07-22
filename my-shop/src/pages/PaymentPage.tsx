import React, { useState } from "react";
import CardRegistrationForm from "../components/payment/CardRegistrationForm";
import CardList from "../components/payment/CardList";
import PurchaseButton from "../components/payment/PurchaseButton";
import type { Card } from "../data/cards";

const PaymentPage = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const handleRegister = (card: Card) => {
    setCards([...cards, card]);
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">결제 정보</h1>
      <CardRegistrationForm onRegister={handleRegister} />
      <CardList cards={cards} />
      <PurchaseButton cards={cards} />
    </div>
  );
};

export default PaymentPage;
