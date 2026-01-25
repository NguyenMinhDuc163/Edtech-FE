import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import loginVisual from "@assets/pictures/login.png";
import { APP_TEXTS } from "../../utils/ui/texts";
import "./styles/Auth.css";
import { Eye, EyeOff } from "lucide-react";
import { getHomeRouteByRole } from "@/utils/routes/homeRoute";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { useLoadingStore } from "@/store/loadingStore";

type LoginForm = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setServerError(null);
  };

  const validate = (): boolean => {
    if (!form.username.trim()) {
      showToast("Vui lòng nhập tài khoản", "warning");
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
      const responseData = await login(form.username, form.password);
      if (responseData.status === 200) {
        showToast("Đăng nhập thành công!", "success");
        const loggedInUser = responseData?.data?.user;

        if (loggedInUser?.role) {
          navigate(getHomeRouteByRole(loggedInUser.role));
        } else {
          navigate("/");
        }
      } else {
        showToast(responseData.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const isRegisterActive = location.pathname.includes("register");

  return (
    <div className="auth-page">
      <div
        className="auth-visual"
        style={{ backgroundImage: `url(${loginVisual})` }}
      >
      </div>

      <div className="auth-form-container">
        <h2 className="auth-heading">{APP_TEXTS.WELCOME_MESSAGE}</h2>

        <div
          className={`tab-switch ${
            isRegisterActive ? "register-active" : "auth-active"
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
          Edtech giúp bạn kết nối với hàng ngàn khóa học trực tuyến chất lượng
          cao...
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="input-group">
            <label>Tài khoản hoặc Email</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tài khoản hoặc email"
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
                placeholder="Nhập mật khẩu"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className="auth-options">
            <label style={{ cursor: "pointer" }}>
              <input type="checkbox" />
              <span>Nhớ mật khẩu</span>
            </label>
            <a href="/forgot" style={{ textDecoration: "none" }}>
              Quên mật khẩu?
            </a>
          </div>

          {serverError && (
            <div
              className="error-message server-error"
              style={{ color: "red", marginBottom: 10 }}
            >
              {serverError}
            </div>
          )}

          <button className="auth-button">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}
