import React from "react";
import { User as UserIcon } from "lucide-react";
import type { User } from "@/types/User/users.type";

interface TeacherListProps {
  teachers: User[];
  onDelete: (userId: string) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, onDelete }) => {
  if (teachers.length === 0) {
    return <div className="admin-teacher-empty">Không tìm thấy giáo viên.</div>;
  }

  return (
    <div className="admin-teacher-list">
      {teachers.map((teacher) => (
        <div key={teacher.id} className="admin-teacher-item">
          <div className="admin-teacher-avatar">
            {teacher.avatar_url ? (
              <img src={teacher.avatar_url} alt={teacher.full_name || teacher.username} />
            ) : (
              <div className="admin-teacher-avatar-placeholder">
                <UserIcon size={40} />
              </div>
            )}
          </div>

          <div className="admin-teacher-info">
            <div className="admin-teacher-header-row">
              <h3>{teacher.full_name || teacher.username}</h3>
              <span className={`admin-teacher-status ${teacher.is_active ? "active" : "inactive"}`}>
                {teacher.is_active ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>

            <div className="admin-teacher-meta">
              <p><strong>Username:</strong> {teacher.username}</p>
              <p><strong>Email:</strong> {teacher.email}</p>
              <p><strong>SĐT:</strong> {teacher.phone || "Chưa cập nhật"}</p>
              <p><strong>Chuyên môn:</strong> {teacher.subject_specialty || "Chưa cập nhật"}</p>
            </div>
          </div>

          <div className="admin-teacher-actions">
            <button className="admin-teacher-btn-delete" onClick={() => onDelete(teacher.id)}>
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherList;
