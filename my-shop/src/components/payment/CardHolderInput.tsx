import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CardHolderInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="소유자 이름"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default CardHolderInput;