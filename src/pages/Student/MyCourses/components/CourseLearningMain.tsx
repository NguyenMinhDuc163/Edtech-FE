import { FaCheck, FaFileAlt } from "react-icons/fa";
import type { CourseContent } from "../libs/interface/courseDetail";
import type { CourseFile } from "@/types/Course/course_detail.type";
import "../style/CourseLearningMain.css";
import { FormattedText } from "@/utils/ui/formatText/formattext";
import LessonPlayer from "./LessonPlayer";
import { getMasteryInfo } from "@/utils/helper/masteryHelper";

interface MainProps {
  courseId: string;
  content: CourseContent | null;
  onOpenModal: (file: CourseFile) => void;
  onLessonComplete: () => void;
}

export default function CourseLearningMain({
  courseId,
  content,
  onOpenModal,
  onLessonComplete,
}: MainProps) {
  if (!content) {
    return (
      <div className="welcome-screen">
        <h2>Chào mừng quay trở lại!</h2>
        <p>Hãy chọn một bài học từ menu bên phải để tiếp tục.</p>
      </div>
    );
  }

  const masteryInfo = getMasteryInfo(content.mastery_level);
  const progressPercent = Math.max(
    0,
    Math.min(100, ((content.mastery_level + 3) / 6) * 100)
  );

  const mainFile =
    content.files && content.files.length > 0 ? content.files[0] : null;
  const isVideo = mainFile?.fileType === "video";
  const videoUrl = mainFile?.url || "";

  return (
    <main className="learning-viewer-area">
      <div className="viewer-container">
        <div className="lesson-meta-header">
          <h2 className="lesson-heading">{content.title}</h2>

          {content.mastery_level > -3 && (
            <div className="mastery-badge-compact flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500 font-medium">
                  Trình độ:
                </span>
                <span className={`text-sm font-bold ${masteryInfo.text}`}>
                  {masteryInfo.label}
                </span>
              </div>

              <div className="mastery-track w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${masteryInfo.color}`}
                  style={{ width: `${progressPercent}%` }}
                  title={`Điểm đánh giá: ${content.mastery_level.toFixed(2)}`}
                ></div>
              </div>

              {progressPercent < 50 && (
                <span className="text-[10px] text-gray-400 italic">
                  Hãy làm thêm bài tập để nâng hạng!
                </span>
              )}
            </div>
          )}
        </div>

        <div className="content-viewport">
          {isVideo && mainFile ? (
            <div className="video-player-wrapper">
              <LessonPlayer
                key={content.content_id}
                courseId={courseId}
                contentId={content.content_id}
                videoUrl={videoUrl}
                onLessonComplete={onLessonComplete}
              />
            </div>
          ) : mainFile ? (
            <div
              className="file-preview-card"
              onClick={() => onOpenModal(mainFile as CourseFile)}
            >
              <div className="card-icon-bg">
                <FaFileAlt />
              </div>
              <div className="card-content">
                <h3>Tài liệu học tập</h3>
                <p>Nhấn để mở xem toàn màn hình</p>
                <button className="btn-open-file">Xem ngay</button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={onLessonComplete}
                  className="flex items-center gap-2 mx-auto text-sm text-blue-600 hover:underline"
                >
                  <FaCheck /> Đánh dấu đã đọc xong
                </button>
              </div>
            </div>
          ) : (
            <div className="no-content-state">
              Bài học này chưa có nội dung.
            </div>
          )}
        </div>

        <div className="lesson-divider" />

        <div className="lesson-details-box">
          <h4>Mô tả bài học</h4>
          <FormattedText
            content={
              content.description || "Chưa có mô tả chi tiết cho bài học này."
            }
            className="desc-text"
          />
        </div>
      </div>
    </main>
  );
}
