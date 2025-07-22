import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CardExpiryInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="MM/YY"
      maxLength={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default CardExpiryInput;