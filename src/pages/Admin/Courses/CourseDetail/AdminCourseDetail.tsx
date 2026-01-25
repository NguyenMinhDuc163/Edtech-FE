import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDateTime } from "@/utils/date/formatDateTime";
import { adminCourseService } from "@/services/Course/adminCourseStatsService";
import "./style/AdminCourseDetail.css";
import type { CourseContent, CourseDetail } from "@/types/Course/course.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import {
  COURSE_CATEGORY_LABEL,
  COURSE_STATUS_LABEL,
  COURSE_VISIBILITY_LABEL,
} from "@/utils/ui/constants";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { FaChevronDown, FaFile, FaFilePdf, FaVideo } from "react-icons/fa";
import ModalViewer from "@/pages/Common/Viewer/components/ModalViewer";
import type { CourseFile } from "@/types/Course/course_detail.type";
import { FormattedText } from "@/utils/ui/formatText/formattext";

export default function AdminCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { showToast } = useToast();
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [lessonDetailsCache, setLessonDetailsCache] = useState<
    Record<string, CourseContent>
  >({});
  const [previewFile, setPreviewFile] = useState<CourseFile | null>(null);
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);

  const toggleLesson = async (lessonId: string) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
      return;
    }

    setExpandedLessonId(lessonId);

    if (!lessonDetailsCache[lessonId]) {
      setLoadingLessonId(lessonId);
      try {
        const detail = await adminCourseService.getLessonDetail(lessonId);
        setLessonDetailsCache((prev) => ({ ...prev, [lessonId]: detail }));
      } catch (error) {
        showToast("Lỗi tải chi tiết bài học", "error");
      } finally {
        setLoadingLessonId(null);
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type === "video") return <FaVideo className="file-icon" />;
    if (type === "pdf") return <FaFilePdf className="file-icon" />;
    return <FaFile className="file-icon" />;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await adminCourseService.getAdminCourseById(
          Number(courseId)
        );
        setCourse(res);
      } catch (err) {
        showToast("Không thể tải dữ liệu khóa học", "error");
        console.error("Load course detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (!course)
    return <div className="course-detail-empty">Không tìm thấy khóa học.</div>;

  const handleExport = async (courseId: string) => {
    try {
      const res = await adminCourseService.exportCourse(courseId);

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `course_${courseId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedSections = (course.sections || [])
    .slice()
    .sort(
      (a, b) =>
        a.order - b.order || parseInt(a.sectionId) - parseInt(b.sectionId)
    )
    .map((section) => ({
      ...section,
      lessons: (section.lessons || [])
        .slice()
        .sort(
          (a, b) =>
            a.order - b.order || parseInt(a.lessonId) - parseInt(b.lessonId)
        ),
    }));

  return (
    <div className="course-detail-page">
      <div className="course-detail-container">
        <header className="course-detail-header">
          <button className="course-detail-back" onClick={() => navigate(-1)}>
            Quay lại
          </button>
          <h2 className="course-detail-title">{course.title}</h2>
        </header>

        <section className="course-detail-top">
          <div className="course-detail-thumbnail-wrapper">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="course-detail-thumbnail"
            />
          </div>

          <div className="course-detail-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Giảng viên</span>
                <span className="info-value">
                  {course.teacher ?? "Giáo viên"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Danh mục</span>
                <span className="info-value category-tag">
                  {COURSE_CATEGORY_LABEL[course.category]}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Trạng thái</span>
                <span
                  className={`course-detail-status-badge ${course.status.toLowerCase()}`}
                >
                  {COURSE_STATUS_LABEL[course.status] ?? course.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Hiển thị</span>
                <span className="info-value">
                  {COURSE_VISIBILITY_LABEL[course.visibility] ??
                    course.visibility}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Thời lượng</span>
                <span className="info-value">{course.courseDuration} giờ</span>
              </div>
              <div className="info-item">
                <span className="info-label">Giá</span>
                <span className="info-value price">
                  {formatCurrency(Number(course.price), course.currency)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày tạo</span>
                <span className="info-value">
                  {formatDateTime(course.createdAt)}
                </span>
              </div>
            </div>

            <div className="info-description">
              <h3 className="desc-title">Mô tả ngắn</h3>
              <FormattedText
                className="desc-content"
                content={course.description}
              />
            </div>

            <div className="info-description">
              <h3 className="desc-title">Chi tiết</h3>
              <FormattedText
                className="desc-content"
                content={course.courseDescription}
              />
            </div>

            <div className="course-detail-actions">
              <button
                className="detail-btn detail-btn-primary"
                onClick={() =>
                  navigate(`/admin/courses/${course.courseId}/leaderboard`)
                }
              >
                Xem bảng xếp hạng
              </button>
              <button
                className="detail-btn detail-btn-secondary"
                onClick={() =>
                  navigate(`/admin/courses/${course.courseId}/stats`)
                }
              >
                Thống kê khóa học
              </button>
              <button
                className="detail-btn detail-btn-secondary"
                onClick={() => handleExport(course.courseId)}
              >
                Xuất báo cáo
              </button>
            </div>
          </div>
        </section>

        <section className="course-detail-section">
          <h3 className="course-detail-subtitle">Danh sách phần & bài học</h3>

          {sortedSections.length ? (
            sortedSections.map((section, index) => (
              <div
                key={section.sectionId}
                className="course-detail-section-item"
              >
                <h4>
                  Chương {index + 1}: {section.title}
                </h4>

                <ul>
                  {section.lessons?.map((lesson, lIdx) => {
                    const isExpanded = expandedLessonId === lesson.lessonId;
                    const detailData = lessonDetailsCache[lesson.lessonId];
                    const isLoading = loadingLessonId === lesson.lessonId;

                    return (
                      <li key={lesson.lessonId} className="section-lesson-item">
                        <div
                          className="lesson-header-row"
                          onClick={() => toggleLesson(lesson.lessonId)}
                        >
                          <span className="section-lesson-title">
                            Bài {lIdx + 1}. {lesson.title}
                          </span>
                          <FaChevronDown
                            className={`chevron-icon ${
                              isExpanded ? "expanded" : ""
                            }`}
                          />
                        </div>

                        {isExpanded && (
                          <div className="lesson-detail-expanded">
                            {isLoading ? (
                              <div className="lesson-loading-text">
                                Đang tải dữ liệu...
                              </div>
                            ) : detailData ? (
                              <>
                                {section.description && (
                                  <FormattedText
                                    content={section.description}
                                    className="lesson-desc-text"
                                  />
                                )}

                                {detailData.files &&
                                detailData.files.length > 0 ? (
                                  <div className="lesson-file-list">
                                    <strong>
                                      Tài liệu đính kèm (
                                      {detailData.files.length}):
                                    </strong>
                                    {detailData.files.map((file) => (
                                      <div
                                        key={file.fileId}
                                        className="lesson-file-item"
                                        onClick={() => setPreviewFile(file)}
                                      >
                                        {getFileIcon(file.fileType)}
                                        <span>{file.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="lesson-empty-text">
                                    Không có tài liệu nào.
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="lesson-empty-text">
                                Không thể tải thông tin bài học.
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <p className="course-detail-empty">Chưa có nội dung nào.</p>
          )}
        </section>
      </div>
      {previewFile && (
        <ModalViewer
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          accessLevel="FULL"
        />
      )}
    </div>
  );
}
