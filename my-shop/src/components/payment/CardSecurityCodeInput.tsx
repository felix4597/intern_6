import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CardSecurityCodeInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="password"
      placeholder="CVC"
      maxLength={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default CardSecurityCodeInput;