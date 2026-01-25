import React from "react";
import { FaTimes } from "react-icons/fa";
import "../style/CourseLeaderboardModal.css";
import type { LeaderboardItem } from "../../CourseDetail/components/LeaderboardWidget";
import LeaderboardWidget from "../../CourseDetail/components/LeaderboardWidget";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LeaderboardItem[];
  currentStudentId?: string;
  loading: boolean;
}

const CourseLeaderboardModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  currentStudentId,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="cl-modal-overlay" onClick={onClose}>
      <div className="cl-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Nút đóng */}
        <button className="cl-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Nội dung chính */}
        <div className="cl-modal-body">
          {loading ? (
            <div className="cl-modal-loading">Đang tải xếp hạng...</div>
          ) : (
            <LeaderboardWidget
              data={data}
              title="Bảng Vàng Khóa Học"
              currentStudentId={currentStudentId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLeaderboardModal;