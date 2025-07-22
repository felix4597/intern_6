import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CardNumberInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="카드 번호 (16자리)"
      maxLength={16}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default CardNumberInput;