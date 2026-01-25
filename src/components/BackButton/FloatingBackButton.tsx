import { useNavigate } from "react-router-dom";
import "./Floating-back-button.css";

interface FloatingBackButtonProps {
  to?: string;       
  label?: string;      
  className?: string;   
}

export const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  to,
  label = "Quay lại",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // quay lại trang trước
    }
  };

  return (
    <button
      className={`edtech-floating-back-btn ${className}`}
      onClick={handleBack}
      aria-label="Back"
    >
      {label}
    </button>
  );
};
