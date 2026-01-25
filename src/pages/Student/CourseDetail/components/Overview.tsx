import { FaBookOpen, FaPlay, FaLock, FaChevronDown } from "react-icons/fa";
import type {
  CourseDetail,
  CourseFile,
} from "@/types/Course/course_detail.type";
import { useState } from "react";
import "../style/Overview.css";
import ModalViewer from "../../../Common/Viewer/components/ModalViewer";
import { useNavigate } from "react-router-dom";
import { FormattedText } from "@/utils/ui/formatText/formattext";

interface OverviewProps {
  course: CourseDetail;
}

export function Overview({ course }: OverviewProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);
  const navigate = useNavigate();

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFileClick = (file: CourseFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="overview-section">
      {course?.sections && course.sections.length > 0 && (
        <div className="student-course-sections">
          <h3 className="student-course-section-title">Lộ trình khóa học</h3>

          {course.sections.map((section) => (
            <div key={section.sectionId} className="section-card">
              <div
                className="section-header"
                onClick={() => toggleSection(section.sectionId)}
              >
                <div className="section-header-content">
                  <h4>
                    Phần {section.orderIndex}: {section.title}
                  </h4>
                  <FormattedText className="overview-section-description" content={section.description} />
                </div>
                <FaChevronDown
                  className={`chevron-icon ${expandedSections.includes(section.sectionId)
                      ? "expanded"
                      : ""
                    }`}
                />
              </div>

              {expandedSections.includes(section.sectionId) && (
                <div className="section-contents">
                  {section.contents?.map((content, contentIndex) => {
                    const lessonNumber = contentIndex + 1;
                    const isMissingFiles =
                      !content.files || content.files.length === 0;

                    const isNotPurchased = course.accessLevel === "FREE";

                    const canView = !isNotPurchased || content.isPreview;
                    const showUpdatingMsg = canView && isMissingFiles;
                    const isLocked = !canView || isMissingFiles;

                    let statusMessage = null;
                    let statusClass = "";

                    if (showUpdatingMsg) {
                      statusMessage = "Bài giảng đang được cập nhật";
                      statusClass = "updating";
                    } else if (!canView) {
                      statusMessage =
                        "Bạn cần mua khóa học để xem được bài giảng";
                      statusClass = "restricted";
                    }

                    return (
                      <div
                        key={content.contentId}
                        className={`content-card ${isLocked ? "locked" : ""}`}
                      >
                        <div className="content-info">
                          <span className="content-icon">
                            <FaBookOpen />
                          </span>
                          <div>
                            <p className="content-title">
                              Bài {lessonNumber}: {content.title}
                              {!canView && (
                                <FaLock className="locked-icon-inline" />
                              )}
                              {isNotPurchased && content.isPreview && (
                                <span
                                  className="preview-badge"
                                  style={{
                                    marginLeft: "8px",
                                    fontSize: "12px",
                                    background: "#e0f2fe",
                                    color: "#0ea5e9",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  Xem trước
                                </span>
                              )}
                            </p>

                            {content.description && (
                              <p className="content-desc">
                                {content.description}
                              </p>
                            )}

                            {statusMessage && (
                              <div className={`status-message ${statusClass}`}>
                                <p>{statusMessage}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {canView && !isMissingFiles && (
                          <ul className="content-files">
                            {content.files.map((file) => (
                              <div key={file.fileId}>
                                <span
                                  className="file-link"
                                  onClick={() => handleFileClick(file)}
                                >
                                  <FaPlay /> {file.title}
                                </span>
                              </div>
                            ))}
                          </ul>
                        )}

                        {content.quiz && (
                          <div className="quiz-wrapper">
                            {canView ? (
                              <button
                                className="quiz-button"
                                onClick={() =>
                                  navigate(
                                    `/student/course/${course.courseId}/exams/${content.quiz.questionBankId}/preview`
                                  )
                                }
                              >
                                <span className="quiz-icon-wrapper">📝</span>
                                <span className="quiz-title-text">
                                  {content.quiz.quizTitle}
                                </span>
                                {isNotPurchased && content.isPreview && (
                                  <span className="preview-badge">
                                    Xem trước
                                  </span>
                                )}
                              </button>
                            ) : (
                              <p className="quiz-locked-text">
                                <FaLock /> Bạn cần mua khóa học mới có thể làm
                                bài thi
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedFile && (
        <ModalViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          accessLevel={course.accessLevel}
        />
      )}
    </div>
  );
}
