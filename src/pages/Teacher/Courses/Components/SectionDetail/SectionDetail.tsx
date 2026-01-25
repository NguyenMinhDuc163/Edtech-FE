import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonsBySectionService, createLessonService } from "@/services/Course/Lesson/lessonService";
import { deleteSectionService } from "@/services/Course/Section/deleteSectionService";
import { deleteLessonService } from "@/services/Course/Lesson/deleteLessonService";
import { getTeacherCourseDetail } from "@/services/Course/getTeacherCourseDetailService";
import type { CourseContent, CourseDetail } from "@/types/Course/course.type";
import "./sectionDetail.css";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ModalViewer from "@/pages/Common/Viewer/components/ModalViewer";
import type { CourseFile } from "@/types/Course/course_detail.type";
import { useLoadingStore } from "@/store/loadingStore";
export default function SectionDetail() {
  const { courseId, sectionId } = useParams<{
    courseId: string;
    sectionId: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [lessons, setLessons] = useState<CourseContent[]>([]);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [deletingSection, setDeletingSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);

  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    is_preview: "N" as "Y" | "N",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kiểm tra trạng thái khóa học
  const isCoursePending = course?.status?.toLowerCase() === "pending";

  const fetchData = async () => {
    if (!sectionId || !courseId) return;

    try {
      const [lessonData, courseData] = await Promise.all([
        getLessonsBySectionService(sectionId),
        getTeacherCourseDetail(courseId),
      ]);
      setLessons(lessonData);
      setCourse(courseData);
    } catch (error) {
      showToast('Không thể tải danh sách bài học!', "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId, courseId]);

  const openDeleteLessonModal = (contentId: string) => {
    if (isCoursePending) {
      showToast("Không thể xóa bài học khi khóa học đang chờ duyệt!", "warning");
      return;
    }
    setDeletingLessonId(contentId);
    setShowDeleteLessonModal(true);
  };

  const confirmDeleteLesson = async () => {
    if (!deletingLessonId) return;

    try {
      setLessons((prev) => prev.filter((l) => l.contentId !== deletingLessonId));
      await deleteLessonService(deletingLessonId);
      showToast('Đã xóa bài học thành công!', "success");

    } catch (error: any) {
      showToast('Xóa bài học thất bại!', "error");
    } finally {
      setShowDeleteLessonModal(false);
      setDeletingLessonId(null);
    }
  };

  const openDeleteSectionModal = () => {
    if (isCoursePending) {
      showToast("Không thể xóa chương khi khóa học đang chờ duyệt!", "warning");
      return;
    }
    setShowDeleteSectionModal(true);
  };

  const confirmDeleteSection = async () => {
    setDeletingSection(true);
    try {
      await deleteSectionService(sectionId!);
      showToast('Đã xóa chương thành công!', "success");
      navigate(`/teacher/courses/${courseId}`);
    } catch (error: any) {
      showToast('Xóa chương thất bại!', "error");
    } finally {
      setDeletingSection(false);
      setShowDeleteSectionModal(false);
    }
  };

  const handleAddLesson = async () => {
    if (isSaving) return;
    setIsSaving(true);

    if (!sectionId || !courseId) {
      showToast('Thiếu thông tin khóa học hoặc phần học!', "warning");
      setIsSaving(false);
      return;
    }

    if (!newLesson.title.trim()) {
      showToast('Tiêu đề là bắt buộc!', "warning");
      setIsSaving(false);
      return;
    }

    try {
      await createLessonService({
        course_id: courseId!,
        section_id: sectionId!,
        title: newLesson.title,
        description: newLesson.description || undefined,
        is_preview: newLesson.is_preview,
        files: selectedFiles,
      });

      showToast('Đã lưu bài học vào bản nháp!', "success");
      setShowForm(false);
      setNewLesson({ title: "", description: "", is_preview: "N" });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchData();
    } catch (error: any) {
      showToast('Lỗi khi tạo bài học!', "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileClick = (file: CourseFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="section-detail-container">
      <div className="section-detail-header">
        <div>
          <h2>Danh sách bài học - {lessons[0]?.sectionTitle || "Chương"}</h2>
          {isCoursePending && (
            <p className="pending-warning">
              Khóa học đang chờ duyệt – Không thể chỉnh sửa hoặc xóa nội dung
            </p>
          )}
        </div>
      </div>

      {/* MODAL XÓA BÀI HỌC */}
      {showDeleteLessonModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteLessonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận xóa bài học</h3>
            <p>Bạn có chắc chắn muốn <strong>xóa bài học này</strong> không?</p>
            <p style={{ color: "#e74c3c" }}>Hành động này không thể hoàn tác!</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteLessonModal(false)}>Hủy</button>
              <button className="danger" onClick={confirmDeleteLesson}>
                Xóa bài học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÓA CHƯƠNG */}
      {showDeleteSectionModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteSectionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận xóa chương</h3>
            <p><strong>Tất cả bài học và tài liệu trong chương sẽ bị xóa vĩnh viễn!</strong></p>
            <p style={{ color: "#e74c3c" }}>Hành động này <strong>không thể hoàn tác</strong>.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteSectionModal(false)}>Hủy</button>
              <button className="danger" onClick={confirmDeleteSection} disabled={deletingSection}>
                {deletingSection ? "Đang xóa..." : "Xóa chương"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form thêm bài học - giữ nguyên */}
      {showForm && (
        <div className="lesson-form">
          <input
            type="text"
            placeholder="Tiêu đề bài học *"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
          />
          <textarea
            placeholder="Mô tả (tùy chọn)"
            value={newLesson.description}
            onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
            rows={4}
          />
          <div className="file-upload">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => {
                if (e.target.files) setSelectedFiles(Array.from(e.target.files));
              }}
            />
            <p>{selectedFiles.length} file(s) đã chọn</p>
          </div>

          <label className="preview-checkbox">
            <input
              type="checkbox"
              checked={newLesson.is_preview === "Y"}
              onChange={(e) => setNewLesson({ ...newLesson, is_preview: e.target.checked ? "Y" : "N" })}
            />
            Cho phép xem trước miễn phí
          </label>
          <div className="form-actions">
            <button onClick={handleAddLesson} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu bài học"}
            </button>
            <button className="cancel" onClick={() => {
              setShowForm(false);
              setNewLesson({ title: "", description: "", is_preview: "N" });
              setSelectedFiles([]);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách bài học */}
      {lessons.length === 0 ? (
        <p>Chưa có bài học nào.</p>
      ) : (
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <div key={lesson.contentId} className="lesson-card">
              <div className="lesson-info">
                <h3>{lesson.title}</h3>
                {lesson.description && <p>{lesson.description}</p>}
                <small>Ngày tạo: {new Date(lesson.createdAt).toLocaleString("vi-VN")}</small>
                {lesson.isPreview === true && <span className="preview-badge">Xem trước</span>}
              </div>
              {lesson.files?.length > 0 && (
                <div className="lesson-files">
                  {lesson.files.map((file) => (
                    <div
                      key={file.fileId}
                      className="lesson-file-item"
                      onClick={() => handleFileClick(file as CourseFile)}
                      style={{ cursor: "pointer" }}
                    >
                      {file.title}
                    </div>
                  ))}
                </div>
              )}
              <button
                className="delete-lesson-btn"
                onClick={() => openDeleteLessonModal(lesson.contentId)}
                disabled={isCoursePending}
                title={isCoursePending ? "Không thể xóa khi đang chờ duyệt" : ""}
              >
                Xóa bài học
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="header-actions">
        <button
          className="delete-section-btn"
          onClick={openDeleteSectionModal}
          disabled={deletingSection || isCoursePending}
          title={isCoursePending ? "Không thể xóa khi đang chờ duyệt" : "Xóa toàn bộ chương"}
        >
          {deletingSection ? "Đang xóa..." : "Xóa chương"}
        </button>
        <button className="add-lesson-btn" onClick={() => navigate(`/teacher/courses/${courseId}/pendings-history`)}>
          Lịch sử thay đổi
        </button>
        <button
          className="add-lesson-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Ẩn form" : "Thêm bài học mới"}
        </button>
      </div>
      {selectedFile && (
        <ModalViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          accessLevel={'FULL'}
        />
      )}
    </div>
  );
}