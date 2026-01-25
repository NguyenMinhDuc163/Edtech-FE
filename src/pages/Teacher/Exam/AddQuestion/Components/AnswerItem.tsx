import type { Answer } from "@/types/Exam/Question/question.type";
import React from "react";
import { FaTrash, FaCheck } from "react-icons/fa";

interface Props {
  index: number;
  answer: Answer;
  onChange: (val: Answer) => void;
  onRemove: () => void;
}

export const AnswerItem: React.FC<Props> = ({
  index,
  answer,
  onChange,
  onRemove,
}) => {
  const labelChar = String.fromCharCode(65 + index);

  return (
    <div
      className={`question-answer-row ${answer.is_correct ? "is-correct" : ""}`}
    >
      <div className="question-answer-label">{labelChar}</div>

      <input
        type="text"
        className="question-answer-input"
        placeholder={`Nhập đáp án ${labelChar}`}
        value={answer.content}
        onChange={(e) => onChange({ ...answer, content: e.target.value })}
      />

      <label className="question-answer-check" title="Đánh dấu là đáp án đúng">
        <input
          type="checkbox"
          checked={answer.is_correct}
          onChange={(e) =>
            onChange({ ...answer, is_correct: e.target.checked })
          }
          hidden
        />
        <span
          className={`question-check-box ${answer.is_correct ? "checked" : ""}`}
        >
          {answer.is_correct && <FaCheck />}
        </span>
      </label>

      <button
        type="button"
        className="question-answer-remove"
        onClick={onRemove}
        title="Xóa đáp án"
      >
        <FaTrash />
      </button>
    </div>
  );
};
