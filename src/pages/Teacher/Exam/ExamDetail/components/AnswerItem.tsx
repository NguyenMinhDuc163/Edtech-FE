import React from "react";
import type { Answer } from "@/types/Exam/examDetail.type";

interface Props {
  answer: Answer;
}

export const AnswerItem: React.FC<Props> = ({ answer }) => {
  return (
    <div
      className={`answer-item ${
        answer.isCorrect ? "correct-answer" : "incorrect-answer"
      }`}
    >
      <span className="answer-text">{answer.content}</span>
      {answer.isCorrect && <span className="correct-badge">✔</span>}
    </div>
  );
};
