import React, { useState, useEffect } from "react";
import { userService } from "@/services/User/userService";
import { useLoadingStore } from "@/store/loadingStore";
import type { User } from "@/types/User/users.type";
import "./EditProfileModal.css";
import { useToast } from "@/components/Notification/common/ToastProvider";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSuccess: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [specialty, setSpecialty] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && currentUser) {
      setFullName(currentUser.full_name || "");
      setPhone(currentUser.phone || "");
      setGrade(currentUser.grade || "");
      setSpecialty(currentUser.subject_specialty || "");
      setPreviewUrl(currentUser.avatar_url || "");
      setAvatarFile(null);
    }

    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, currentUser]);

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

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("phone", phone);
    formData.append("grade", grade);
    formData.append("subject_specialty", specialty);

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
            <label>Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Trình độ</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="VD: Lớp 12"
              />
            </div>
            <div className="form-group">
              <label>Chuyên môn</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="VD: Toán học"
              />
            </div>
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

export default EditProfileModal;
