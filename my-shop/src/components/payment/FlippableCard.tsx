import React from "react";
import "./FlippableCard.css";

interface Props {
  front: React.ReactNode;
  back: React.ReactNode;
}

const FlippableCard: React.FC<Props> = ({ front, back }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
};

export default FlippableCard;
