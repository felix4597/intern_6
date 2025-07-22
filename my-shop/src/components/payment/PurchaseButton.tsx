import React from "react";
import type { Card } from "../../data/cards";

interface Props {
  cards: Card[];
}

const PurchaseButton: React.FC<Props> = ({ cards }) => {
  const handlePurchase = () => {
    if (cards.length > 0) {
      alert("결제가 완료되었습니다.");
    } else {
      alert("카드를 먼저 등록해주세요.");
    }
  };

  return (
    <button
      onClick={handlePurchase}
      className="bg-blue-500 text-white py-2 px-4 rounded w-full"
    >
      결제하기
    </button>
  );
};

export default PurchaseButton;