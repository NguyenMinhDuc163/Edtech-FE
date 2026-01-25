import { useEffect, type JSX } from "react";
import { createPortal } from "react-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import "../style/Toast.css";

type ToastType = "success" | "error" | "warning" | "info";

const icons: Record<ToastType, JSX.Element> = {
  success: <FaCheckCircle color="#4caf50" />,
  error: <FaTimesCircle color="#f44336" />,
  warning: <FaExclamationTriangle color="#ff9800" />,
  info: <FaInfoCircle color="#2196f3" />,
};

export default function Toast({
  message,
  type = "success",
  duration = 2500,
  onClose,
}: {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastContent = (
    <div className={`toast-container ${type}`} onClick={onClose}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
    </div>
  );

  return createPortal(toastContent, document.body);
}
