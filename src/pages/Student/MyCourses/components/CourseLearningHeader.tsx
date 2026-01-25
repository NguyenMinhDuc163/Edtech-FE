import { useNavigate, useParams } from "react-router-dom";
import "../style/CourseLearningHeader.css";
import { FaBars, FaChevronLeft, FaTrophy } from "react-icons/fa";
import { FileText } from "lucide-react";

interface HeaderProps {
  title: string;
  progress: number;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onShowLeaderboard?: () => void;
}

export default function CourseLearningHeader({
  title,
  progress,
  isSidebarOpen,
  toggleSidebar,
  onShowLeaderboard,
}: HeaderProps) {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const handleGoToExams = () => {
    navigate(`/student/course/${courseId}/exams`);
  };
  return (
    <header className="learning-header compact">
      <div className="header-left">
        <button
          className="btn-back-circle"
          onClick={() => navigate(-1)}
          title="Quay lại Dashboard"
        >
          <FaChevronLeft />
        </button>
        <h1 className="course-title-compact" title={title}>
          {title}
        </h1>
      </div>

      <div className="header-right">
        <div className="progress-compact">
          <span className="progress-text">{Math.round(progress)}%</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="header-actions-divider"></div>

        <button
          className="cl-action-btn"
          onClick={handleGoToExams}
          title="Danh sách bài kiểm tra"
        >
          <FileText size={20} />
          <span className="cl-btn-text">Bài kiểm tra</span>
        </button>

        <div className="header-actions-divider"></div>
        {onShowLeaderboard && (
          <button
            className="btn-header-action"
            onClick={onShowLeaderboard}
            title="Bảng xếp hạng học tập"
          >
            <FaTrophy className="text-yellow-400" />
          </button>
        )}

        <div className="header-actions-divider"></div>

        <button
          className={`btn-header-action ${!isSidebarOpen ? "active" : ""}`}
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Đóng danh sách" : "Mở danh sách"}
        >
          <FaBars />
        </button>
      </div>
    </header>
  );
}
