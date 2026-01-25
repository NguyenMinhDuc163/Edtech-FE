import type { QuizInfo } from "@/types/Exam/exam.type";
import { formatDateTime } from "@/utils/date/formatDateTime";
import React from "react";

const PreviewExamInfo: React.FC<{ quizInfo: QuizInfo }> = ({ quizInfo }) => {
  return (
    <div className="exam-info">
      <div className="info-row">
        <span className="info-label">Mô tả:</span>
        <span className="info-value">{quizInfo.quizDescription}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Loại bài:</span>
        <span className="info-value">{quizInfo.quizType}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Bắt buộc:</span>
        <span className="info-value">
          {quizInfo.isRequired ? "Có" : "Không"}
        </span>
      </div>

      <div className="info-row">
        <span className="info-label">Điểm đạt:</span>
        <span className="info-value">{quizInfo.passingScore}%</span>
      </div>

      <div className="info-row">
        <span className="info-label">Số lần làm tối đa:</span>
        <span className="info-value">{quizInfo.maxAttempts}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Lần làm còn lại:</span>
        <span className="info-value">{quizInfo.remainingAttempts}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Bắt đầu:</span>
        <span className="info-value">{formatDateTime(quizInfo.startTime)}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Kết thúc:</span>
        <span className="info-value">{formatDateTime(quizInfo.endTime)}</span>
      </div>
    </div>
  );
};

export default PreviewExamInfo;
