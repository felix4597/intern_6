import React from "react";
import type { Card } from "../../data/cards";
import CryptoJS from "crypto-js";

interface Props {
  cards: Card[];
  selectedCardId: number | null;
  onSelectCard: (id: number) => void;
}

const decrypt = (ciphertext: string): string => {
  const secretKey = "my-secret-key";
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const CardList: React.FC<Props> = ({ cards, selectedCardId, onSelectCard }) => {
  return (
    <div className="space-y-3 mb-4">
      <h2 className="text-lg font-semibold text-gray-700">등록된 카드</h2>
      {cards.map((card) => {
        const isSelected = card.id === selectedCardId;
        return (
          <div
            key={card.id}
            onClick={() => onSelectCard(card.id)}
            className={`transition-all duration-200 cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md ${
              isSelected
                ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
                : "bg-white"
            }`}
          >
            <div className="text-sm font-medium text-gray-800">
              {card.cardHolder}
            </div>
            <div className="text-sm text-gray-600">
              **** **** **** {decrypt(card.cardNumber).slice(-4)} (만료:{" "}
              {card.expiry})
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
