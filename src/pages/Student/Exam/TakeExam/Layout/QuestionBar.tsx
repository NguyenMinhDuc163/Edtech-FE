import React from "react";
import type { Question, ExamAnswer } from "../../../../../types/Exam/exam.type";

interface Props {
  questions: Question[];
  examAnswers: ExamAnswer[];
}

export const QuestionBar: React.FC<Props> = ({ questions, examAnswers }) => (
  <div className="question-bar">
    <div className="question-bar-content">
      <div className="question-bar-title">Danh sách câu hỏi</div>

      <div className="question-list">
        {questions.map((q, i) => {
          const isAnswered = examAnswers.some(
            (a) => a.questionId === q.questionId
          );

          return (
            <div
              key={q.questionId}
              className={isAnswered ? "question-item-selected" : "question-item-default"}
            >
              <div className="question-item-number">{i + 1}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
