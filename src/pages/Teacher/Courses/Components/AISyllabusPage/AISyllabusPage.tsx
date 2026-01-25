import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { previewAICourse, importAICourse } from "@/services/Course/createCourseService";
import "./AISyllabusPage.css";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

interface Lesson {
  title: string;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

interface Syllabus {
  courseTitle: string;
  objective?: string;
  sections: Section[];
}

const AISyllabusPage = () => {
  const [instruction, setInstruction] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Syllabus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [courseId, setCourseId] = useState<string>("");

  const navigate = useNavigate();

  const toggleSection = (sectionIndex: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionIndex)) {
        newSet.delete(sectionIndex);
      } else {
        newSet.add(sectionIndex);
      }
      return newSet;
    });
  };

  const handlePreview = async () => {
    if (!instruction.trim()) {
      setError("Vui lòng nhập mô tả khóa học");
      return;
    }

    try {
      setError(null);
      setLoadingPreview(true);
      setIsEditing(false);

      const res = await previewAICourse({ instruction });
      setPreviewData(res);

      const allSections = new Set(res.sections.map((_, index) => index));
      setExpandedSections(allSections);
    } catch (err: any) {
      setError(err?.message || "Preview thất bại");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    try {
      setError(null);
      setLoadingImport(true);

      const payload = {
        syllabus: previewData,
        thumbnail_url: "https://edtechblob.blob.core.windows.net/thumbnails/thumbnail_7.jpg",
      };

      const res = await importAICourse(payload);

      const createdCourseId = res.data.course_id || res.data.id || res.data.courseId;

      if (!createdCourseId) {
        console.error("Không nhận được courseId từ server");
        setError("Tạo thành công nhưng không thể chuyển hướng. Vui lòng kiểm tra danh sách khóa học.");
        return;
      }

      setCourseId(createdCourseId);
      setShowSuccessDialog(true);
    } catch (err: any) {
      setError(err?.message || "Tạo khóa học thất bại");
    } finally {
      setLoadingImport(false);
    }
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    navigate(`/teacher/courses/${courseId}`);
  };

  const updateCourseTitle = (newTitle: string) => {
    if (previewData) {
      setPreviewData({ ...previewData, courseTitle: newTitle });
    }
  };

  const updateSectionTitle = (sectionIndex: number, newTitle: string) => {
    if (previewData) {
      const newSections = [...previewData.sections];
      newSections[sectionIndex].title = newTitle;
      setPreviewData({ ...previewData, sections: newSections });
    }
  };

  const updateLessonTitle = (
    sectionIndex: number,
    lessonIndex: number,
    newTitle: string
  ) => {
    if (previewData) {
      const newSections = [...previewData.sections];
      newSections[sectionIndex].lessons[lessonIndex].title = newTitle;
      setPreviewData({ ...previewData, sections: newSections });
    }
  };

  return (
    <div className="ai-syllabus-container">
      <h1>Giáo án AI</h1>

      {/* Input Section */}
      <div className="input-section">
        <label htmlFor="course-description">Mô tả khóa học</label>
        <textarea
          id="course-description"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Ví dụ: Tạo giáo án Python từ cơ bản đến nâng cao cho người mới"
        />
      </div>

      {/* Actions */}
      <div className="actions">
        <button
          className="preview-btn"
          onClick={handlePreview}
          disabled={loadingPreview}
        >
          {loadingPreview ? (
            <>
              <span className="spinner"></span> Đang phân tích và tạo giáo án...
            </>
          ) : (
            "Xem giáo án"
          )}
        </button>

        {previewData && (
          <>
            <button
              className="edit-toggle-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Hoàn tất chỉnh sửa" : "Chỉnh sửa giáo án"}
            </button>

            <button
              className="import-btn"
              onClick={handleImport}
              disabled={loadingImport}
            >
              {loadingImport ? (
                <>
                  <span className="spinner"></span> Đang tạo...
                </>
              ) : (
                "Tạo khóa học"
              )}
            </button>
          </>
        )}
      </div>

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Preview Section */}
      {previewData && (
        <div className="preview-section">
          <div className="course-title-wrapper">
            {isEditing ? (
              <input
                type="text"
                value={previewData.courseTitle}
                onChange={(e) => updateCourseTitle(e.target.value)}
                className="course-title-input"
                autoFocus
              />
            ) : (
              <h2 className="course-title-view">{previewData.courseTitle}</h2>
            )}
          </div>

          {previewData.sections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.has(sectionIndex);

            return (
              <div key={sectionIndex} className="section-card">
                <div className="section-header">
                  <button
                    className="section-toggle"
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▶</span>
                  </button>

                  {isEditing ? (
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(sectionIndex, e.target.value)
                      }
                      className="section-title-input"
                    />
                  ) : (
                    <h3 className="section-title-view">{section.title}</h3>
                  )}
                </div>

                {isExpanded && (
                  <ul className="lesson-list">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="lesson-item">
                        {isEditing ? (
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) =>
                              updateLessonTitle(
                                sectionIndex,
                                lessonIndex,
                                e.target.value
                              )
                            }
                            className="lesson-title-input"
                          />
                        ) : (
                          <span className="lesson-title-view">{lesson.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-icon">✓</div>
            <h2 className="dialog-title">Tạo khóa học thành công!</h2>
            <p className="dialog-message">Khóa học của bạn đã được tạo và lưu vào hệ thống.</p>
            <button className="dialog-btn" onClick={handleCloseDialog}>
              Xem khóa học
            </button>
          </div>
        </div>
      )}
      <FloatingBackButton/>
    </div>
  );
};

export default AISyllabusPage;