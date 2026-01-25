import React, { useState, useEffect } from "react";
import { userService } from "@/services/User/userService";
import { useLoadingStore } from "@/store/loadingStore";
import type { User } from "@/types/User/users.type";
import "./EditProfileModal.css";
import { useToast } from "@/components/Notification/common/ToastProvider";

interface StudentEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSuccess: (updatedUser: User) => void;
}

const StudentEditProfileModal: React.FC<StudentEditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setFullName(currentUser.full_name || "");
      setPhone(currentUser.phone || "");
      setEmail(currentUser.email || "");
      setPreviewUrl(currentUser.avatar_url || "");
      setAvatarFile(null);
      setErrors({ email: "", phone: "" });
    }

    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, currentUser]);

  const validateEmail = (value: string): string => {
    if (!value.trim()) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
    return "";
  };

  const validatePhone = (value: string): string => {
    if (!value.trim()) return "";
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(value)) {
      return "Số điện thoại phải có 10-11 số và bắt đầu bằng 0 hoặc +84";
    }
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Vui lòng chỉ tải lên file ảnh!", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB", "error");
        return;
      }

      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      showToast("Vui lòng kiểm tra lại thông tin", "error");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("phone", phone);
    formData.append("email", email);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(formData);
      showToast("Cập nhật hồ sơ thành công!", "success");
      onSuccess(updatedUser);
      onClose();
    } catch (error) {
      showToast("Cập nhật thất bại. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chỉnh sửa hồ sơ</h3>
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="image-upload-section">
            <div className="image-preview">
              <img
                src={previewUrl || "src/assets/pictures/student.png"}
                alt="Preview"
              />
              <label htmlFor="avatar-input" className="upload-label">
                📷
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </div>
            <p className="upload-hint">Nhấn vào máy ảnh để thay đổi</p>
          </div>

          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên của bạn"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="email@example.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="0912..."
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditProfileModal;
