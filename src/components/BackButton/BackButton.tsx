import React from "react";
import "./BackButton.css";

interface BackButtonProps {
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label = "Quay lại" }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button className="back-btn" onClick={handleBack}>
      <span className="arrow">←</span>
      {label}
    </button>
  );
};

export default BackButton;
