import React from "react";
import { useLoadingStore } from "@/store/loadingStore";
import "./GlobalLoading.css";

const GlobalLoading: React.FC = () => {
  const { isLoading, showGlobal } = useLoadingStore();

  if (!isLoading || !showGlobal) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Đang tải...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;
