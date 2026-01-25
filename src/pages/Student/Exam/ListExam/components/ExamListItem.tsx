import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ExamListItemType } from "@/types/Exam/examList.type";
import { EXAM_TYPE_LABEL } from "@/utils/ui/constants";

export const ExamListItem: React.FC<{ exam: ExamListItemType }> = ({
  exam,
}) => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const getBadgeClass = (type: string) => {
    return type === "Quiz" ? "badge-quiz" : "badge-exam";
  };

  return (
    <div className="exam-card">
      <div className="exam-card-body">
        <div className="exam-card-top">
          <h3 className="exam-title" title={exam.quizTitle}>
            {exam.quizTitle}
          </h3>
          <span className={`quiz-type-tag ${getBadgeClass(exam.quizType)}`}>
            {EXAM_TYPE_LABEL[exam.quizType] ?? exam.quizType}
          </span>
        </div>

        <p className="exam-description">
          {exam.quizDescription || "Không có mô tả"}
        </p>

        <div className="exam-stats">
          <div className="exam-stat-item">
            <span className="exam-stat-label">Thời gian</span>
            <span className="exam-stat-value">
              {exam.startTime == null || exam.endTime == null
                ? "--"
                : `${exam.startTime} - ${exam.endTime} phút`}
            </span>
          </div>
          <div className="exam-stat-item">
            <span className="exam-stat-label">Điểm đạt</span>
            <span className="exam-stat-value">{exam.passingScore}%</span>
          </div>
          <div className="exam-stat-item">
            <span className="exam-stat-label">Lần làm</span>
            <span className="exam-stat-value">
              {exam.maxAttempts === 0 ? "∞" : exam.maxAttempts}
            </span>
          </div>
        </div>
      </div>

      <div className="exam-card-footer">
        <button
          className="btn-action btn-history"
          onClick={() =>
            navigate(`/student/course/${courseId}/exams/${exam.quizId}/history`)
          }
        >
          Lịch sử
        </button>
        <button
          className="btn-action btn-start"
          onClick={() =>
            navigate(`/student/course/${courseId}/exams/${exam.quizId}/preview`)
          }
        >
          Làm bài ngay
        </button>
      </div>
    </div>
  );
};
