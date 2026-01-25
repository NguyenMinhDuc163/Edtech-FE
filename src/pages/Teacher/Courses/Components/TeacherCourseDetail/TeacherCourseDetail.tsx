import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { changeCourseVisibility, getTeacherCourseDetail } from "@/services/Course/getTeacherCourseDetailService";
import defaultThumbnail from "@/assets/pictures/empty_course.png";
import { createSectionService } from "@/services/Course/Section/createSectionService";
import { getSectionsByCourseService } from "@/services/Course/Section/getSectionsByCourseService";
import { getLessonsBySectionService } from "@/services/Course/Lesson/lessonService";
import { submitCourseForApproval, updateCourse } from "@/services/Course/createCourseService";
import type { CourseDetail } from "@/types/Course/course.type";
import type { Section } from "@/types/Course/Section/section.type";

import "./TeacherCourseDetail.css";
import { useLoadingStore } from "@/store/loadingStore";
import { COURSE_STATUS_LABEL } from "@/utils/ui/constants";
import { FormattedText } from "@/utils/ui/formatText/formattext";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

type NotificationType = "success" | "error" | "warning" | null;

export default function TeacherCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");
  const [newSectionDescription, setNewSectionDescription] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [lessonsBySection, setLessonsBySection] = useState<Record<string, any[]>>({});
  const [submittingSection, setSubmittingSection] = useState(false);
  const [changingVisibility, setChangingVisibility] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(course?.title || "");
  const [editDescription, setEditDescription] = useState(course?.description || "");
  const [editPrice, setEditPrice] = useState(course?.price || "0");

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Hàm hiển thị thông báo
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load course
  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      const result = await getTeacherCourseDetail(courseId);
      const normalizedStatus = typeof result.status === "string" ? result.status.trim().toUpperCase() : result.status;
      setCourse({ ...result, status: normalizedStatus });
      setEditTitle(result.title);
      setEditDescription(result.description || "");
      setEditPrice(result.price);

    } catch {
      showNotification("error", "Không tải được thông tin khóa học");
    }
  };

  // Load sections
  const fetchSections = async () => {
    if (!courseId) return;
    try {
      const list = await getSectionsByCourseService(courseId);
      setSections(list);
    } catch {
      showNotification("error", "Không tải được danh sách chương");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchSections();
  }, [courseId]);

  // Toggle section
  const handleToggleSection = async (sectionId: string) => {
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(null);
      return;
    }

    if (!lessonsBySection[sectionId]) {
      try {
        const lessons = await getLessonsBySectionService(sectionId);
        setLessonsBySection((prev) => ({ ...prev, [sectionId]: lessons }));
      } catch {
        showNotification("error", "Không tải được bài học");
      }
    }

    setExpandedSectionId(sectionId);
  };

  // Add Section
  const handleAddSection = async () => {
    if (submittingSection) return;
    if (!newSectionTitle.trim()) {
      showNotification("warning", "Vui lòng nhập tiêu đề chương");
      return;
    }

    setSubmittingSection(true);

    const payload = {
      title: newSectionTitle.trim(),
      description: newSectionDescription.trim() || undefined,
      order_index: sections.length + 1,
      course_id: courseId!,
    };

    try {
      await createSectionService(payload);

      showNotification("success", "Đã thêm chương vào bản nháp!");
      await fetchSections();
      setShowInput(false);
      setNewSectionTitle("");
      setNewSectionDescription("");
    } catch (error: any) {
      const msg = error.message || "Thêm chương thất bại";

      if (msg.includes("trong thay đổi chờ duyệt")) {
        showNotification("error", `Chương "${newSectionTitle}" đã tồn tại trong thay đổi chờ duyệt!`);
      }
      else if (msg.includes("trong khóa học này") || msg.includes("đã tồn tại trong khóa học")) {
        showNotification("error", `Tên section "${newSectionTitle}" đã tồn tại trong khóa học này!`);
      }
      else {
        showNotification("error", msg);
      }
    }
    finally {
      setSubmittingSection(false);
    }
  };

  const handleVisibilityToggle = () => {
    if (!course || changingVisibility) return;

    const newVisibility = course.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";

    setConfirmMessage(
      newVisibility === "PUBLIC"
        ? "Bạn có chắc muốn chuyển khóa học thành CÔNG KHAI?"
        : "Bạn có chắc muốn chuyển khóa học thành RIÊNG TƯ?"
    );

    setConfirmAction(() => async () => {
      setChangingVisibility(true);
      try {
        await changeCourseVisibility(courseId!, newVisibility);
        setCourse(prev => prev ? { ...prev, visibility: newVisibility } : null);
        showNotification(
          "success",
          `Khóa học đã được chuyển thành ${newVisibility === "PUBLIC" ? "công khai" : "riêng tư"}!`
        );
      } catch (error: any) {
        showNotification("error", error?.message || "Không thể thay đổi trạng thái hiển thị");
      } finally {
        setChangingVisibility(false);
      }
    });

    setConfirmOpen(true);
  };


  const ConfirmModal = () => {
    if (!confirmOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3 className="modal-title">Xác nhận</h3>
          <p className="modal-message">{confirmMessage}</p>

          <div className="modal-buttons">
            <button
              className="modal-btn cancel"
              onClick={() => setConfirmOpen(false)}
            >
              Hủy
            </button>

            <button
              className="modal-btn confirm"
              onClick={() => {
                if (confirmAction) confirmAction();
                setConfirmOpen(false);
              }}
            >
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Submit for approval
  const handleSubmitForApproval = async () => {
    if (!courseId || !course) return;
    setSubmitting(true);
    try {
      await submitCourseForApproval(courseId);
      showNotification("success", "Đã gửi yêu cầu phê duyệt khóa học!");
      setCourse(prev => prev ? { ...prev, status: "PENDING" } : null);
    } catch (error: any) {
      showNotification("error", error?.message || "Gửi phê duyệt thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) return <p className="loading">Không tìm thấy khóa học.</p>;

  return (
    <div className="course-detail-container">
      {/* Notification UI */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="close-btn">×</button>
        </div>
      )}

      {/* Course Header */}
      <div className="course-header">
        <img src={course.thumbnailUrl || defaultThumbnail} alt={course.title} className="thumbnail" />
        <div className="course-infotc">
        <h2 className="editable-title">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="editable-title-input"
            />
          ) : (
            course.title
          )}
        </h2>


        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textareatc"
          />
        ) : (
          <FormattedText content={course.description} className="short-desc" maxLength={300} />
        )}

          <div className="price-info">
            <span className="price">
              {Number(course.price) === 0 ? (
                <span className="free-label">Miễn phí</span>
              ) : course.discountAmount && parseFloat(course.discountAmount) > 0 ? (
                <>
                  <span className="original-price">
                    {Number(course.price).toLocaleString('vi-VN')} {course.currency}
                  </span>

                  <span className="discounted-price">
                    {(Number(course.price) - Number(course.discountAmount)).toLocaleString('vi-VN')} {course.currency}
                  </span>

                  <span className="discount-badge">
                    -{((Number(course.discountAmount) / Number(course.price)) * 100).toFixed(0)}%
                  </span>
                </>
              ) : (
                <>
                  {Number(course.price).toLocaleString('vi-VN')} {course.currency}
                </>
              )}
            </span>
          </div>

          <p className="meta">
            Thời lượng: {course.courseDuration || "?"} giờ |
            {" "}Hiển thị:{" "}
            <button
              onClick={handleVisibilityToggle}
              disabled={changingVisibility || course.status === "PENDING"}
              className={`visibility-toggle ${course.visibility.toLowerCase()} ${changingVisibility || course.status === "PENDING" ? "disabled" : ""}`}
              title={course.status === "PENDING" ? "Không thể thay đổi khi đang chờ duyệt" : "Nhấp để chuyển PUBLIC ↔ PRIVATE"}
            >
              {changingVisibility ? (
                "Đang cập nhật..."
              ) : course.visibility === "PUBLIC" ? (
                <>
                  Công khai
                </>
              ) : (
                <>
                  Riêng tư
                </>
              )}
            </button>
            {" "}| Trạng thái: <strong>{COURSE_STATUS_LABEL[course.status.trim().toUpperCase()] || course.status}</strong>
          </p>

          <p className="created-at">
            Ngày tạo: {new Date(course.createdAt).toLocaleDateString("vi-VN", {
              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="course-sections">
        <h3>Chương</h3>
        {sections.length > 0 ? (
          sections.map((section) => (
          <div key={section.sectionId} className="section-block">
            <div
              className="section-header"
              onClick={() => handleToggleSection(section.sectionId)}
            >
              <h4 className="section-title">{section.title}</h4>
            </div>

            {expandedSectionId === section.sectionId && (
              <div className="lesson-list">
                {lessonsBySection[section.sectionId]?.length ? (
                  lessonsBySection[section.sectionId].map((lesson) => (
                    <div key={lesson.contentId} className="lesson-item">
                      {lesson.title}
                    </div>
                  ))
                ) : (
                  <p className="no-lesson">Chưa có bài học nào</p>
                )}
              </div>
            )}

            {/* NÚT LUÔN Ở CUỐI CHƯƠNG */}
            <div className="section-footer">
              <button
                className="edit-section-btn"
                onClick={() =>
                  navigate(`/teacher/courses/${courseId}/sections/${section.sectionId}`)
                }
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          ))
        ) : (
          <p className="no-section">Chưa có chương nào</p>
        )}
      </div>
      {/* Add Section Button */}
      <button className="add-section-btn" onClick={() => setShowInput(true)}>
        Tạo chương mới
      </button>

      <button className="add-section-btn" onClick={() => navigate(`/teacher/courses/${courseId}/exam`)}>
        Bài kiểm tra
      </button>

      <button className="add-section-btn" onClick={() => navigate(`/teacher/courses/${courseId}/pendings-history`)}>
        Lịch sử thay đổi
      </button>

      <button className="add-section-btn" onClick={() => navigate(`/teacher/courses/map/${courseId}`)}>
        Thiết lập lộ trình học
      </button>

      <button
        className="add-section-btn"
        onClick={async () => {
          if (isEditing) {
            if (
              editTitle === course.title &&
              editDescription === (course.description || "") &&
              Number(editPrice) === Number(course.price)
            ) {
              setIsEditing(false);
              showNotification("warning", "Không có thay đổi để lưu");
              return;
            }
            try {
              setLoading(true);
              await updateCourse(courseId!, {
                title: editTitle,
                description: editDescription,
                price: Number(editPrice),
              });
              showNotification("success", "Cập nhật khóa học thành công!");
              await fetchCourse();
            } catch (error: any) {
              showNotification("error", error?.message || "Cập nhật thất bại");
            } finally {
              setLoading(false);
              setIsEditing(false);
            }
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "Lưu" : "Chỉnh sửa"}
      </button>

      {/* Add Section Popup */}
      {showInput && (
        <div className="add-section-popup">
          <input
            type="text"
            placeholder="Tiêu đề chương..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}
          />
          <textarea
            placeholder="Mô tả chương"
            value={newSectionDescription}
            onChange={(e) => setNewSectionDescription(e.target.value)}
            className="section-desc-input"
            style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}
            rows={3}
          />
          <div className="popup-buttons">
            <button
              onClick={handleAddSection}
              disabled={submittingSection}
              style={submittingSection ? { opacity: 0.6 } : {}}
            >
              {submittingSection ? "Đang thêm..." : "Thêm"}
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewSectionTitle("");
                setNewSectionDescription("");
              }}
              className="cancel-btn"
              disabled={submittingSection}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {course && ["DRAFT", "REJECTED"].includes(course.status) && (
        <button
          className="floating-submit-btn"
          onClick={handleSubmitForApproval}
          disabled={submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi phê duyệt"}
        </button>
      )}
      <ConfirmModal />
      <FloatingBackButton/>
    </div>
  );
}