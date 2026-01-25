import React, { useState, useEffect } from "react";
import { userService } from "@/services/User/userService";
import { useLoadingStore } from "@/store/loadingStore";
import type { User } from "@/types/User/users.type";
import "./EditProfileModal.css";
import { useToast } from "@/components/Notification/common/ToastProvider";

interface TeacherEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSuccess: (updatedUser: User) => void;
}

interface CertificateForm {
  id?: string;
  title: string;
  description: string;
  issued_by: string;
  issued_at: string;
  expires_at: string;
  file: File | null;
  file_url?: string;
}

const TeacherEditProfileModal: React.FC<TeacherEditProfileModalProps> = ({
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
  const [grade, setGrade] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [certificates, setCertificates] = useState<CertificateForm[]>([]);

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });
  const [certificateErrors, setCertificateErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen && currentUser) {
      setFullName(currentUser.full_name || "");
      setPhone(currentUser.phone || "");
      setEmail(currentUser.email || "");
      setGrade(currentUser.grade || "");
      setSpecialty(currentUser.subject_specialty || "");
      setPreviewUrl(currentUser.avatar_url || "");
      setAvatarFile(null);
      setErrors({ email: "", phone: "" });
      setCertificateErrors({});

      const existingCerts = currentUser.certificates?.map((cert) => ({
        id: cert.id,
        title: cert.title,
        description: cert.description || "",
        issued_by: cert.issued_by,
        issued_at: cert.issued_at.split("T")[0],
        expires_at: cert.expires_at ? cert.expires_at.split("T")[0] : "",
        file: null,
        file_url: cert.file_url,
      })) || [];
      setCertificates(existingCerts);
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

  const validateCertificate = (cert: CertificateForm): string => {
    if (cert.title.trim() && (!cert.issued_by.trim() || !cert.issued_at)) {
      return "Vui lòng điền đầy đủ thông tin: Đơn vị cấp và Ngày cấp";
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

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      {
        title: "",
        description: "",
        issued_by: "",
        issued_at: "",
        expires_at: "",
        file: null,
      },
    ]);
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
    setCertificateErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const updateCertificate = (index: number, field: keyof CertificateForm, value: any) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    setCertificates(updated);

    const error = validateCertificate(updated[index]);
    setCertificateErrors((prev) => ({
      ...prev,
      [index]: error,
    }));
  };

  const handleCertificateFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast("File quá lớn! Vui lòng chọn file dưới 10MB", "error");
        return;
      }
      updateCertificate(index, "file", file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);

    const certErrors: Record<number, string> = {};
    certificates.forEach((cert, index) => {
      const error = validateCertificate(cert);
      if (error) certErrors[index] = error;
    });

    if (emailError || phoneError || Object.keys(certErrors).length > 0) {
      setErrors({ email: emailError, phone: phoneError });
      setCertificateErrors(certErrors);
      showToast("Vui lòng kiểm tra lại thông tin", "error");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("grade", grade);
    formData.append("subject_specialty", specialty);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    certificates.forEach((cert) => {
      if (cert.title.trim()) {
        formData.append("certificate_title", cert.title);
        formData.append("certificate_description", cert.description);
        formData.append("certificate_issued_by", cert.issued_by);
        formData.append("certificate_issued_at", cert.issued_at);
        formData.append("certificate_expires_at", cert.expires_at);
        if (cert.file) {
          formData.append("certificate_file", cert.file);
        }
      }
    });

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
      <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chỉnh sửa hồ sơ giảng viên</h3>
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

          <div className="form-row">
            <div className="form-group">
              <label>Trình độ / Khối</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="VD: Thạc sĩ, THPT"
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

          <div className="certificates-section">
            <div className="section-header">
              <h4>Chứng chỉ</h4>
              <button type="button" className="btn-add-cert" onClick={addCertificate}>
                + Thêm chứng chỉ
              </button>
            </div>

            {certificates.map((cert, index) => (
              <div key={index} className="certificate-item">
                <div className="cert-header">
                  <span className="cert-number">Chứng chỉ {index + 1}</span>
                  <button
                    type="button"
                    className="btn-remove-cert"
                    onClick={() => removeCertificate(index)}
                  >
                    Xóa
                  </button>
                </div>

                <div className="form-group">
                  <label>Tên chứng chỉ</label>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => updateCertificate(index, "title", e.target.value)}
                    placeholder="VD: IELTS 7.5"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={cert.description}
                    onChange={(e) => updateCertificate(index, "description", e.target.value)}
                    placeholder="Mô tả chi tiết về chứng chỉ"
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label>Đơn vị cấp</label>
                  <input
                    type="text"
                    value={cert.issued_by}
                    onChange={(e) => updateCertificate(index, "issued_by", e.target.value)}
                    placeholder="VD: British Council"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày cấp</label>
                    <input
                      type="date"
                      value={cert.issued_at}
                      onChange={(e) => updateCertificate(index, "issued_at", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày hết hạn</label>
                    <input
                      type="date"
                      value={cert.expires_at}
                      onChange={(e) => updateCertificate(index, "expires_at", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>File chứng chỉ</label>
                  {cert.file_url && !cert.file && (
                    <div className="existing-file">
                      <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                        Xem file hiện tại
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleCertificateFileChange(index, e)}
                    accept="image/*,.pdf"
                  />
                  {cert.file && <span className="file-selected">{cert.file.name}</span>}
                </div>

                {certificateErrors[index] && (
                  <div className="error-message cert-error">{certificateErrors[index]}</div>
                )}
              </div>
            ))}

            {certificates.length === 0 && (
              <p className="no-certificates">Chưa có chứng chỉ. Nhấn "Thêm chứng chỉ" để thêm mới.</p>
            )}
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

export default TeacherEditProfileModal;
