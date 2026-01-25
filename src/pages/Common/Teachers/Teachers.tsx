import React, { useEffect, useState } from "react";
import { teacherService } from "@/services/User/teacherService";
import type { User } from "@/types/User/users.type";
import { Award, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react";
import "./style/Teachers.css";
import { useLoadingStore } from "@/store/loadingStore";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Teacher&background=667eea&color=fff&size=200";

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [expandedCerts, setExpandedCerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await teacherService.getTeachersList();
        setTeachers(data);
      } catch (err) {
        console.error("Load teachers error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const toggleCertificate = (certId: string) => {
    setExpandedCerts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(certId)) {
        newSet.delete(certId);
      } else {
        newSet.add(certId);
      }
      return newSet;
    });
  };

  return (
    <div className="teachers-page">
      <div className="teachers-hero">
        <div className="teachers-hero-content">
          <h1>Đội Ngũ Giảng Viên</h1>
          <p className="teachers-hero-subtitle">
            Gặp gỡ các giảng viên giàu kinh nghiệm và tận tâm của chúng tôi
          </p>
        </div>
      </div>

      <div className="teachers-container">
        {teachers.length === 0 ? (
          <div className="teachers-empty">Chưa có giảng viên nào.</div>
        ) : (
          <div className="teachers-grid">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-card-header">
                  <div className="teacher-avatar">
                    <img
                      src={teacher.avatar_url || DEFAULT_AVATAR}
                      alt={teacher.full_name || teacher.username}
                    />
                  </div>
                  <div className="teacher-basic-info">
                    <h3>{teacher.full_name || teacher.username}</h3>
                    {teacher.subject_specialty && (
                      <p className="teacher-specialty">{teacher.subject_specialty}</p>
                    )}
                  </div>
                </div>

                {(teacher.email || teacher.phone) && (
                  <div className="teacher-contact">
                    {teacher.email && (
                      <div className="teacher-contact-item">
                        <Mail size={16} />
                        <span>{teacher.email}</span>
                      </div>
                    )}
                    {teacher.phone && (
                      <div className="teacher-contact-item">
                        <Phone size={16} />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {teacher.certificates && teacher.certificates.length > 0 && (
                  <div className="teacher-certificates">
                    <div className="certificates-header">
                      <Award size={18} />
                      <h4>Chứng chỉ ({teacher.certificates.length})</h4>
                    </div>
                    <div className="certificates-list">
                      {teacher.certificates.map((cert) => {
                        const isExpanded = expandedCerts.has(cert.id);
                        return (
                          <div key={cert.id} className="certificate-item">
                            <div
                              className="certificate-header-clickable"
                              onClick={() => toggleCertificate(cert.id)}
                            >
                              <div className="certificate-title-row">
                                <Award size={16} className="certificate-icon" />
                                <p className="certificate-title">{cert.title}</p>
                              </div>
                              <button className="certificate-toggle-btn">
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="certificate-details">
                                {cert.description && (
                                  <p className="certificate-description">{cert.description}</p>
                                )}
                                <div className="certificate-meta">
                                  <div className="certificate-meta-item">
                                    <strong>Cấp bởi:</strong> {cert.issued_by}
                                  </div>
                                  <div className="certificate-meta-item">
                                    <strong>Ngày cấp:</strong> {formatDate(cert.issued_at)}
                                  </div>
                                  {cert.expires_at && (
                                    <div className="certificate-meta-item">
                                      <strong>Hết hạn:</strong> {formatDate(cert.expires_at)}
                                    </div>
                                  )}
                                </div>
                                {cert.file_url && (
                                  <a
                                    href={cert.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="certificate-view-btn"
                                  >
                                    Xem chứng chỉ
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers;
