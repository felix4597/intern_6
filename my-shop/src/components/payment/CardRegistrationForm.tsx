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
    if (number.length === 16 && expiry && holder && securityCode && password) {
      const masked = "****-****-****-" + number.slice(-4);
      onRegister({
        id: Date.now(),
        number: masked,
        expiry,
        holder,
        securityCode,
        password
      });
      setNumber("");
      setExpiry("");
      setHolder("");
      setSecurityCode("");
      setPassword("");
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
        className="bg-green-500 text-white py-2 px-4 rounded w-full"
      >
        카드 등록
      </button>
    </div>
  );
};

export default CardRegistrationForm;
