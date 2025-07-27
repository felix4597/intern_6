import React from "react";
import type { Card } from "../../data/cards";

interface Props {
  cards: Card[];
  onPurchase: () => void;
  disabled: boolean;
}

const PurchaseButton: React.FC<Props> = ({ cards, onPurchase, disabled }) => {
  const hasCard = cards.length > 0;

  const handleClick = () => {
    if (!hasCard) {
      alert("결제 수단이 없습니다. 카드를 등록해주세요.");
      return;
    }
    onPurchase();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !hasCard}
      className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
        !hasCard
          ? "bg-gray-400 cursor-not-allowed"
          : disabled
          ? "bg-blue-500 opacity-60 cursor-wait"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {!hasCard
        ? "카드를 등록해주세요"
        : disabled
        ? "결제 중..."
        : "결제하기"}
    </button>
  );
};

export default PurchaseButton;
