import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import logoImage from "@assets/pictures/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Link to="/" className="footer-logo-area">
          <img src={logoImage} alt="EdTech Logo" className="footer-logo-img" />
          <span className="footer-brand-name">EdTech</span>
        </Link>

        <p className="footer-slogan">
          Khơi nguồn tri thức - Kiến tạo tương lai
        </p>
      </div>

      <div className="footer-subscribe">
        <h2 className="footer-subscribe-title">
          Đăng ký để nhận Bản tin của chúng tôi
        </h2>
        <div className="footer-subscribe-box">
          <input
            type="email"
            className="footer-input"
            placeholder="Email của bạn"
          />
          <button className="footer-btn">Đăng ký</button>
        </div>
      </div>

      <div className="footer-links">
        <a href="/careers">Cơ hội nghề nghiệp</a>
        <span className="divider">|</span>
        <a href="/privacy">Chính sách bảo mật</a>
        <span className="divider">|</span>
        <a href="/terms">Điều khoản và điều kiện</a>
      </div>

      <div className="footer-copy">© 2025 Class Technologies Inc.</div>
    </footer>
  );
};

export default Footer;
