import React from "react";
import type { QuizInfo } from "@/types/Exam/examDetail.type";

interface Props {
  info: QuizInfo;
}

export const ExamInfoCard: React.FC<Props> = ({ info }) => {
  return (
    <div className="exam-info-card">
      <div className="header">
        <h3>{info.quizTitle}</h3>
        <span className={`status-tag ${info.status.toLowerCase()}`}>
          {info.status}
        </span>
      </div>
      <p className="description">{info.quizDescription}</p>

      <div className="info-grid">
        <p>
          <strong>Loại:</strong> {info.quizType}
        </p>
        <p>
          <strong>Điểm đạt:</strong> {info.passingScore}
        </p>
        <p>
          <strong>Số lần làm:</strong> {info.maxAttempts}
        </p>
        <p>
          <strong>Xáo trộn câu hỏi:</strong>{" "}
          {info.isRandomOrder ? "Có" : "Không"}
        </p>
        <p>
          <strong>Xáo trộn đáp án:</strong>{" "}
          {info.isShuffleAnswers ? "Có" : "Không"}
        </p>
        <p>
          <strong>Bắt buộc:</strong> {info.isRequired ? "Có" : "Không"}
        </p>
        <p>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(info.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </div>
  );
};
