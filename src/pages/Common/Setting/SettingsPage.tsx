import React, { useState } from "react";
import {
  FaUserCog,
  FaLock,
  FaBell,
  FaGlobe,
  FaMoon,
  FaSave,
} from "react-icons/fa";
import { useToast } from "@/components/Notification/common/ToastProvider";
import "./style/SettingsPage.css";
import { userService } from "@/services/User/userService";

type SettingsTab = "general" | "security" | "notifications";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    language: "vi",
    theme: "light",
    emailNotif: true,
    pushNotif: false,
    marketingNotif: true,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSettingChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp!", "warning");
      return;
    }

    if (
      !passwordForm.newPassword.trim() ||
      !passwordForm.confirmPassword.trim()
    ) {
      showToast("Mật khẩu không được để trống!", "warning");
      return;
    }

    const response = await userService.changePassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (response.status === true) {
      showToast("Đổi mật khẩu thành công!", "success");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      showToast(response.message, "error");
    }
  };

  return (
    <div className="settings-page-container">
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <button
            className={`settings-nav-item ${
              activeTab === "general" ? "active" : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            <FaUserCog className="nav-icon" />
            Cài đặt chung
          </button>
          <button
            className={`settings-nav-item ${
              activeTab === "security" ? "active" : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <FaLock className="nav-icon" />
            Bảo mật & Mật khẩu
          </button>
          <button
            className={`settings-nav-item ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell className="nav-icon" />
            Thông báo
          </button>
        </aside>

        <main className="settings-content">
          {activeTab === "general" && (
            <div className="settings-section fade-in">
              <h2 className="section-title">Cấu hình chung</h2>

              <div className="form-group">
                <label className="form-label">
                  <FaGlobe /> Ngôn ngữ hiển thị
                </label>
                <select
                  className="form-select"
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="jp">日本語</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaMoon /> Giao diện
                </label>
                <div className="theme-switcher">
                  <button
                    className={`theme-btn ${
                      settings.theme === "light" ? "active" : ""
                    }`}
                    onClick={() => handleSettingChange("theme", "light")}
                  >
                    Sáng
                  </button>
                  <button
                    className={`theme-btn ${
                      settings.theme === "dark" ? "active" : ""
                    }`}
                    onClick={() => handleSettingChange("theme", "dark")}
                  >
                    Tối
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section fade-in">
              <h2 className="section-title">Đổi mật khẩu</h2>
              <form onSubmit={handleSavePassword}>
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-input"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-input"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    <FaSave /> Cập nhật mật khẩu
                  </button>
                </div>
              </form>

              <hr className="divider" />

              <h2 className="section-title text-danger">Tài khoản</h2>
              <p className="danger-desc">
                Khi xóa tài khoản, mọi dữ liệu bài học của bạn sẽ bị mất vĩnh
                viễn.
              </p>
              <button className="btn-danger-outline">Xóa tài khoản</button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-section fade-in">
              <h2 className="section-title">Tùy chọn thông báo</h2>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Email thông báo</h4>
                  <p>Nhận email về bài tập mới và kết quả thi.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotif}
                    onChange={(e) =>
                      handleSettingChange("emailNotif", e.target.checked)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Thông báo trình duyệt</h4>
                  <p>Hiển thị popup khi có tin nhắn từ giảng viên.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotif}
                    onChange={(e) =>
                      handleSettingChange("pushNotif", e.target.checked)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
