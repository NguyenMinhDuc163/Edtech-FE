import React, { useState } from "react";
import { useToast } from "@/components/Notification/common/ToastProvider";
import "../style/CreateUserModal.css";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateUsername = (username: string): string | undefined => {
    if (!username) return "Username là bắt buộc";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username chỉ được chứa chữ cái, số và dấu gạch dưới";
    }
    if (username.length < 3) return "Username phải có ít nhất 3 ký tự";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email là bắt buộc";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không đúng định dạng";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password là bắt buộc";
    if (password.length < 6) return "Password phải có ít nhất 6 ký tự";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch("https://edtech_service.nguyenduc.click/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 201) {
        showToast("Tạo người dùng thành công!", "success");
        onSuccess();
        handleClose();
      } else {
        showToast(data.message || "Đăng ký thất bại", "error");
        setErrors({ email: data.message || "Đăng ký thất bại" });
      }
    } catch (err) {
      showToast("Có lỗi xảy ra, vui lòng thử lại", "error");
      setErrors({ email: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: "", email: "", password: "", role: "teacher" });
    setErrors({});
    onClose();
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm người dùng mới</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>
              Username <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Chỉ chữ cái, số và dấu gạch dưới"
              className={errors.username ? "error" : ""}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="example@email.com"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>
              Vai trò <span className="required">*</span>
            </label>
            <select value={formData.role} onChange={(e) => handleChange("role", e.target.value)}>
              <option value="teacher">Giáo viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Đang xử lý..." : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
