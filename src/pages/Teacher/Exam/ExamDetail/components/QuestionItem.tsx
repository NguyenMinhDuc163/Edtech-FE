import React from "react";
import type { Question } from "@/types/Exam/examDetail.type";
import { AnswerItem } from "./AnswerItem";

interface Props {
  question: Question;
  index: number;
}

export const QuestionItem: React.FC<Props> = ({ question, index }) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-text">
          <span className="question-index">Câu {index}:</span>
          {question.questionText}
        </div>
      </div>
      <div className="answers-list">
        {question.answers.map((ans) => (
          <AnswerItem key={ans.answerId} answer={ans} />
        ))}
      </div>
    </div>
  );
};
