import React, { useState } from "react";
import CardNumberInput from "./CardNumberInput";
import CardExpiryInput from "./CardExpiryInput";
import CardHolderInput from "./CardHolderInput";
import CardSecurityCodeInput from "./CardSecurityCodeInput";
import CardPasswordInput from "./CardPasswordInput";
import type { Card } from "../../data/cards";

interface Props {
  onRegister: (card: Card) => void;
}

const CardRegistrationForm: React.FC<Props> = ({ onRegister }) => {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [holder, setHolder] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const digits = number.replace(/\D/g, "");
    if (digits.length === 16 && expiry && holder && securityCode && password) {
      const masked = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim(); // 마스킹된 1234 5678 9012 3456
      onRegister({
        id: Date.now(),
        cardHolder: holder,
        cardNumber: masked,
        expiry,
        securityCode,
        password
      });

      setNumber("");
      setExpiry("");
      setHolder("");
      setSecurityCode("");
      setPassword("");
    } else {
      alert("모든 입력란을 정확히 입력해주세요.");
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <CardNumberInput value={number} onChange={setNumber} />
      <CardExpiryInput value={expiry} onChange={setExpiry} />
      <CardHolderInput value={holder} onChange={setHolder} />
      <CardSecurityCodeInput value={securityCode} onChange={setSecurityCode} />
      <CardPasswordInput value={password} onChange={setPassword} />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
      >
        카드 등록
      </button>
    </div>
  );
};

export default CardRegistrationForm;
