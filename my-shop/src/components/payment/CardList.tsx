import React from "react";
import type { Card } from "../../data/cards";

interface Props {
  cards: Card[];
}

const CardList: React.FC<Props> = ({ cards }) => {
  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-lg font-semibold">등록된 카드</h2>
      {cards.map((card) => (
        <div key={card.id} className="border p-2 rounded bg-white">
          <p>{card.number} (만료: {card.expiry})</p>
        </div>
      ))}
    </div>
  );
};

export default CardList;