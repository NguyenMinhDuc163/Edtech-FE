import { useEffect, useState } from "react";
import { userService } from "@/services/User/userService";
import { useLoadingStore } from "@/store/loadingStore";
import type { User } from "@/types/User/users.type";
import "./profile.css";
import StudentEditProfileModal from "./components/StudentEditProfileModal";
import TeacherEditProfileModal from "./components/TeacherEditProfileModal";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { userRoles } = useAuthStore();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: User) => {
    setUser(updatedUser);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const profile = await userService.getUser();
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setLoading]);

  const formatRole = (role: string | string[] | undefined | null) => {
    if (!role) return "Thành viên";

    const roleStr = Array.isArray(role) ? role[0] : role;

    const roleMap: Record<string, string> = {
      student: "Học viên",
      teacher: "Giảng viên",
      admin: "Quản trị viên",
    };
    return roleMap[roleStr.toLowerCase()] || roleStr;
  };

  if (!user) return null;

  const currentRole = (userRoles || "").toLowerCase();
  const isTeacher = currentRole.includes("teacher");
  const isStudent = currentRole.includes("student");

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="sidebar-content">
            <div className="avatar-wrapper">
              <img
                src={user.avatar_url}
                alt={user.username}
                className="profile-avatar"
              />
              <span className={`role-badge ${currentRole}`}>
                {formatRole(userRoles)}
              </span>
            </div>

            <h2 className="display-name">{user.full_name || user.username}</h2>
            <p className="username">@{user.username}</p>

            <div className="sidebar-actions">
              <button
                className="btn-edit"
                onClick={() => setIsEditModalOpen(true)}
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3 className="section-title">Thông tin cá nhân</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Họ và tên</label>
                <div className="value">{user.full_name || "Chưa cập nhật"}</div>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <div className="value">{user.email}</div>
              </div>
              <div className="detail-item">
                <label>Số điện thoại</label>
                <div className="value">{user.phone || "Chưa cập nhật"}</div>
              </div>
            </div>
          </div>

          {isTeacher && (user.grade || user.subject_specialty) && (
            <div className="detail-section">
              <h3 className="section-title">Thông tin chuyên môn</h3>
              <div className="detail-grid">
                {user.grade && (
                  <div className="detail-item">
                    <label>Khối lớp / Trình độ</label>
                    <div className="value">{user.grade}</div>
                  </div>
                )}
                {user.subject_specialty && (
                  <div className="detail-item">
                    <label>Chuyên môn</label>
                    <div className="value">{user.subject_specialty}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {isTeacher && user.certificates && user.certificates.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Chứng chỉ</h3>
              <div className="certificates-list">
                {user.certificates.map((cert) => (
                  <div key={cert.id} className="certificate-card">
                    <div className="cert-title">{cert.title}</div>
                    {cert.description && <div className="cert-description">{cert.description}</div>}
                    <div className="cert-info">
                      <div className="cert-detail">
                        <span className="cert-label">Đơn vị cấp:</span>
                        <span>{cert.issued_by}</span>
                      </div>
                      <div className="cert-detail">
                        <span className="cert-label">Ngày cấp:</span>
                        <span>{new Date(cert.issued_at).toLocaleDateString("vi-VN")}</span>
                      </div>
                      {cert.expires_at && (
                        <div className="cert-detail">
                          <span className="cert-label">Hết hạn:</span>
                          <span>{new Date(cert.expires_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                      )}
                    </div>
                    {cert.file_url && (
                      <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="cert-file-link">
                        Xem file chứng chỉ
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isStudent ? (
        <StudentEditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={user}
          onSuccess={handleUpdateSuccess}
        />
      ) : isTeacher ? (
        <TeacherEditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={user}
          onSuccess={handleUpdateSuccess}
        />
      ) : null}
    </div>
  );
}
