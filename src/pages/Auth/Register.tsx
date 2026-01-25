import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import registerVisual from "@assets/pictures/login.png";
import { APP_TEXTS } from "../../utils/ui/texts";
import "./styles/Auth.css";
import { Eye, EyeOff } from "lucide-react";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";

type RegisterForm = {
  email: string;
  username: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    email: "",
    username: "",
    password: "",
  });

  const setLoading = useLoadingStore((state) => state.setLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): boolean => {
    if (!form.email.trim()) {
      showToast("Vui lòng nhập email", "warning");
      return false;
    }

    if (!form.username.trim()) {
      showToast("Vui lòng nhập tên tài khoản", "warning");
      return false;
    }

    if (!form.password.trim()) {
      showToast("Vui lòng nhập mật khẩu", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;
    try {
      setLoading(true);
      const responseData = await register(
        form.email,
        form.username,
        form.password
      );
      if (responseData.message == "Đăng ký tài khoản thành công.") {
        showToast(
          "Đăng ký tài khoản thành công. Bạn có thể đăng nhập ngay.",
          "success"
        );
        navigate("/login");
      } else {
        if (Array.isArray(responseData.message)) {
          responseData.message.forEach((msg) => showToast(msg, "error"));
        } else {
          showToast(responseData.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div
        className="auth-visual"
        style={{ backgroundImage: `url(${registerVisual})` }}
      >
      </div>

      <div className="auth-form-container">
        <h2 className="auth-heading">{APP_TEXTS.WELCOME_MESSAGE}</h2>

        <div
          className={`tab-switch ${
            window.location.pathname.includes("register")
              ? "register-active"
              : "auth-active"
          }`}
        >
          <div className="tab-active"></div>
          <span className="tab-auth" onClick={() => navigate("/login")}>
            Đăng nhập
          </span>
          <span className="tab-register" onClick={() => navigate("/register")}>
            Đăng ký
          </span>
        </div>

        <p className="auth-description">
          Hãy tham gia Edtech để học tập, chia sẻ và phát triển cùng hàng ngàn
          học viên.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="input-group">
            <label>Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>

          <div className="input-group">
            <label>Tài khoản</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tên tài khoản của bạn"
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="auth-options">
            <a href="/login">Đã có tài khoản?</a>
          </div>

          {serverError && <div className="error-message">{serverError}</div>}

          <button className="auth-button">Đăng ký</button>
        </form>
      </div>
    </div>
  );
}
