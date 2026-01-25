import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTeacherCourseDetail } from "@/services/Course/getTeacherCourseDetailService";
import { getSectionsByCourseService } from "@/services/Course/Section/getSectionsByCourseService";
import { getLessonsBySectionService } from "@/services/Course/Lesson/lessonService";

import type { CourseDetail, CourseContent } from "@/types/Course/course.type";
import type { Section } from "@/types/Course/Section/section.type";

import AdminApprovalActions from "../Button/AdminApprovalActions";

import "./ApprovalCourseDetail.css";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { useLoadingStore } from "@/store/loadingStore";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { COURSE_CATEGORY_LABEL, COURSE_STATUS_LABEL } from "@/utils/ui/constants";

export default function AdminCourseApproveDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { showToast } = useToast();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [lessonsBySection, setLessonsBySection] = useState<Record<string, CourseContent[]>>({});
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        setLoading(true)
        const [c, s] = await Promise.all([
          getTeacherCourseDetail(courseId),
          getSectionsByCourseService(courseId),
        ]);
        setCourse(c);
        setSections(s);
      } catch (err) {
        showToast('Không tải được thông tin chi tiết về khóa học!', "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleToggleSection = async (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
      return;
    }

    if (!lessonsBySection[sectionId]) {
      try {
        const lessons = await getLessonsBySectionService(sectionId);
        setLessonsBySection((prev) => ({ ...prev, [sectionId]: lessons }));
      } catch {
        showToast('Không tải được thông tin chi tiết về bài học!', "error");
      }
    }
    setExpandedSection(sectionId);
  };

  const handleViewSectionDetail = (sectionId: string) => {
    navigate(`/admin/courses/${courseId}/sections/${sectionId}`);
  };

  if (!course) return <p className="loading">Không tìm thấy khóa học.</p>;

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const MAX_LENGTH = 220;
  const shouldTruncate = course.courseDescription && course.courseDescription.length > MAX_LENGTH;

  const displayDescription = isExpanded || !shouldTruncate
    ? course.courseDescription
    : `${course.courseDescription.substring(0, MAX_LENGTH)}...`;

  return (
    <div className="course-detail-container">
      <div className="admin-header-wrapper">
        <button className="admin-header-back-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>

        <div className="admin-header-card">
          <div className="admin-header-image-col">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="admin-header-thumb"
            />
            <span className={`admin-status-badge status-${course.status.toLowerCase()}`}>
              {COURSE_STATUS_LABEL[course.status] || course.status}
            </span>
          </div>

          <div className="admin-header-info-col">
            <div className="admin-header-top">
              <span className="admin-category-badge">
                {COURSE_CATEGORY_LABEL[course.category]}
              </span>
              <h1 className="admin-header-title">{course.title}</h1>
            </div>

            <div className="admin-header-meta-grid">
              <div className="meta-item">
                <div className="meta-icon" />
                <div>
                  <span className="meta-label">Giáo viên</span>
                  <span className="meta-value">{course.teacher || "Chưa cập nhật"}</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon" />
                <div>
                  <span className="meta-label">Thời lượng</span>
                  <span className="meta-value">{course.courseDuration} giờ</span>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon" />
                <div>
                  <span className="meta-label">Học phí</span>
                  <span className="meta-value price">
                    {formatCurrency(Number(course.price), course.currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-header-description">
              <h3 className="desc-label">Mô tả tổng quan:</h3>
              <p className="desc-text">
                {displayDescription || "Chưa có mô tả."}
                {shouldTruncate && (
                  <span className="read-more-btn" onClick={toggleReadMore}>
                    {isExpanded ? " Thu gọn" : " Xem thêm"}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="course-sections">
        <h3>Nội dung khóa học</h3>

        {sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.sectionId} className="section-block">
              <div
                className="section-header"
                onClick={() => handleToggleSection(section.sectionId)}
              >
                <h4 className="section-title">{section.title}</h4>

                <button
                  className="btn-view-detail"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewSectionDetail(section.sectionId);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>

              {expandedSection === section.sectionId && (
                <div className="lesson-list">
                  {lessonsBySection[section.sectionId]?.length ? (
                    lessonsBySection[section.sectionId].map((lesson) => (
                      <div key={lesson.contentId} className="lesson-item">
                        {lesson.title}
                      </div>
                    ))
                  ) : (
                    <p className="no-lesson">Chưa có bài học nào trong chương này.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-section">Không có chương nào.</p>
        )}
      </div>

      <div className="action-buttons">
        <AdminApprovalActions courseId={courseId!} redirectPath="/admin/courses/approve" />
      </div>
    </div>
  );
}