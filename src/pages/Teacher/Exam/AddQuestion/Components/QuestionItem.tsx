import React from "react";
import { AnswerItem } from "./AnswerItem";
import type { Answer, Question } from "@/types/Exam/Question/question.type";
import { FaTrash, FaClock, FaPlus } from "react-icons/fa";

interface Props {
  index: number;
  question: Question;
  onChange: (val: Question) => void;
  onRemove: () => void;
}

export const QuestionItem: React.FC<Props> = ({
  index,
  question,
  onChange,
  onRemove,
}) => {
  const handleAddAnswer = () => {
    onChange({
      ...question,
      answers: [...question.answers, { content: "", is_correct: false }],
    });
  };

  const handleRemoveAnswer = (aIndex: number) => {
    const updated = question.answers.filter((_, i) => i !== aIndex);
    onChange({ ...question, answers: updated });
  };

  const handleUpdateAnswer = (aIndex: number, val: Answer) => {
    const updated = [...question.answers];
    updated[aIndex] = val;
    onChange({ ...question, answers: updated });
  };

  return (
    <div className="question-card">
      <div className="question-card-header">
        <span className="question-index">Câu {index + 1}</span>
        <div className="question-card-actions">
          <div className="question-time-input">
            <FaClock className="question-icon-time" />
            <input
              type="number"
              min={5}
              max={600}
              value={question.time_limit_sec}
              onChange={(e) =>
                onChange({ ...question, time_limit_sec: Number(e.target.value) })
              }
              title="Thời gian làm bài (giây)"
            />
            <span>giây</span>
          </div>
          <button type="button" className="question-btn-icon-remove" onClick={onRemove} title="Xóa câu hỏi này">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="question-card-body">
        <div className="question-input-group">
          <textarea
            className="question-textarea"
            value={question.question_text}
            onChange={(e) => onChange({ ...question, question_text: e.target.value })}
            placeholder="Nhập nội dung câu hỏi..."
            rows={2}
          />
        </div>

        <div className="question-answers-container">
          <label className="question-label-sm">Danh sách đáp án (Tick chọn đáp án đúng)</label>
          <div className="question-answers-list">
            {question.answers.map((ans, i) => (
              <AnswerItem
                key={i}
                index={i}
                answer={ans}
                onChange={(val) => handleUpdateAnswer(i, val)}
                onRemove={() => handleRemoveAnswer(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="question-btn-text-add"
            onClick={handleAddAnswer}
          >
            <FaPlus /> Thêm phương án
          </button>
        </div>
      </div>
    </div>
  );
};
