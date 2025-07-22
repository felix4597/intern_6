import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const CardPasswordInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="password"
      placeholder="비밀번호 앞 2자리"
      maxLength={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  );
};

export default CardPasswordInput;