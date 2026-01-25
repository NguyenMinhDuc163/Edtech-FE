import React from "react";
import { QuestionType } from "../libs/constant";
import "../style/Dropdowns.css";

interface Props {
  selectedQuestionType: { value: QuestionType; label: string } | null;
  setSelectedQuestionType: (val: { value: QuestionType; label: string } | null) => void;
}

export const QuestionTypeDropdown: React.FC<Props> = ({
  selectedQuestionType,
  setSelectedQuestionType,
}) => {
  const questionTypes = [
    { value: QuestionType.TN, label: "Trắc Nghiệm" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (!selectedValue) {
      setSelectedQuestionType(null);
      return;
    }
    const selectedOption = questionTypes.find((q) => q.value === selectedValue);
    setSelectedQuestionType(selectedOption || null);
  };

  const currentValue = selectedQuestionType?.value || selectedQuestionType || "";

  return (
    <div className="custom-select-wrapper">
      <select
        className="form-input custom-select"
        value={typeof currentValue === 'object' ? currentValue.value : currentValue}
        onChange={handleChange}
      >
        <option value="" disabled className="placeholder-option">
          -- Chọn loại câu hỏi --
        </option>
        {questionTypes.map((q) => (
          <option key={q.value} value={q.value}>
            {q.label}
          </option>
        ))}
      </select>
      <div className="select-arrow"></div>
    </div>
  );
};