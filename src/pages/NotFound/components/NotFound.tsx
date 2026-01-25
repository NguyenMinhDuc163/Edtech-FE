import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/NotFound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <div className="error-illustration">
          <div className="circle-bg"></div>
          <span className="emoji">🤔</span>
        </div>

        <h2 className="error-title">Oops! Trang không tồn tại</h2>
        <p className="error-desc">
          Có vẻ như đường dẫn bạn đang tìm kiếm không đúng hoặc trang này đã bị
          xóa.
        </p>

        <div className="error-actions">
          <button className="btn-home" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
          <button className="btn-back" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
