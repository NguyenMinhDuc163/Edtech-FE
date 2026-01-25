import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastState {
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("Lỗi hiển thị thông báo");
  }
  return context;
}

export function ToastProvider({ children }: { children: any }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: ToastType = "success",
    duration: number = 2500
  ) => {
    setToast({ message, type, duration });
  };

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  );
}
