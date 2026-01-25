import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ExamItem } from "@/types/Exam/exam.type";

interface ExamItemCardProps {
  exam: ExamItem;
}

export const ExamListItem: React.FC<ExamItemCardProps> = ({ exam }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  return (
    <div key={exam.quizId} className="exam-card">
      <div className="exam-card-header">
        <h3 className="exam-title">{exam.quizTitle}</h3>
        <span
          className={`status-tag ${
            exam.status === "DRAFT"
              ? "draft"
              : exam.status === "PUBLISHED"
              ? "published"
              : "archived"
          }`}
        >
          {exam.status}
        </span>
      </div>

      <div className="exam-info">
        <p>
          <strong>Loại bài:</strong> {exam.quizType}
        </p>
        <p>
          <strong>Dạng câu hỏi:</strong> {exam.questionType}
        </p>
        <p>
          <strong>Số câu hỏi:</strong> {exam.totalQuestions}
        </p>
        <p>
          <strong>Điểm đạt:</strong> {exam.passingScore}
        </p>
        <p>
          <strong>Số lần làm:</strong> {exam.maxAttempts}
        </p>
      </div>

      <div className="exam-footer">
        <span className="exam-date">
          Ngày tạo: {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <div className="exam-actions">
          <button
            className="btn view-btn"
            onClick={() => navigate(`/teacher/courses/${courseId}/exam/${exam.quizId}`)}
          >
            Xem
          </button>
          <button
            className="btn edit-btn"
            onClick={() => navigate(`/teacher/courses/${courseId}/exam/${exam.quizId}/question`)}
          >
            Thêm câu hỏi
          </button>
        </div>
      </div>
    </div>
  );
};
