import React from "react";
import type { Question, ExamAnswer } from "../../../../../types/Exam/exam.type";

interface Props {
  questions: Question[];
  examAnswers: ExamAnswer[];
  setExamAnswers: React.Dispatch<React.SetStateAction<ExamAnswer[]>>;
}

export const TakeExamArea: React.FC<Props> = ({
  questions,
  examAnswers,
  setExamAnswers,
}) => {

  const isSelected = (questionId: string, answerId: string) => {
    return examAnswers.some(
      (a) => a.questionId === questionId && a.answerId === answerId
    );
  };

  const handleSelect = (question: Question, answerId: string) => {
    setExamAnswers((prev) => {
      const exists = prev.some(
        (a) => a.questionId === question.questionId && a.answerId === answerId
      );

      if (exists) {
        return prev.filter(
          (a) => !(a.questionId === question.questionId && a.answerId === answerId)
        );
      }

      return [
        ...prev.filter((a) => a.questionId !== question.questionId),
        {
          questionId: question.questionId,
          answerId: answerId,
        },
      ];
    });
  };

  return (
    <div className="take-area">
      <div className="question-part">

        <div className="questions-container">
          {questions.map((question, index) => (
            <div className="question-card" key={question.questionId}>
              <div className="question-header">
                <div className="question-number">Câu {index + 1}</div>

                <p className="question-text">{question.questionText}</p>

                <div className="question-instruction">
                  Chọn một đáp án đúng
                </div>
              </div>

              <div className="options-container">
                {question.answers.map((ans) => (
                  <div
                    className="option-item"
                    key={ans.answerId}
                    onClick={() => handleSelect(question, ans.answerId)}
                  >
                    <div
                      className={
                        isSelected(question.questionId, ans.answerId)
                          ? "option-selected"
                          : "option-default"
                      }
                    >
                      {String.fromCharCode(65 + question.answers.indexOf(ans))}
                    </div>

                    <div
                      className={
                        isSelected(question.questionId, ans.answerId)
                          ? "option-content-selected"
                          : "option-content-default"
                      }
                    >
                      <p className="option-text">{ans.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
