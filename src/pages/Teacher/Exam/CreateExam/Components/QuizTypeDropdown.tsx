import React from "react";
import { QuizType } from "../libs/constant";
import "../style/Dropdowns.css"; // File CSS chung cho dropdown

interface Props {
  selectedQuizType: { value: QuizType; label: string } | null; // Cập nhật type nếu state cha lưu cả object
  // Hoặc nếu state cha chỉ lưu value thì để: selectedQuizType: QuizType | null;
  setSelectedQuizType: (val: { value: QuizType; label: string } | null) => void;
}

export const QuizTypeDropdown: React.FC<Props> = ({
  selectedQuizType,
  setSelectedQuizType,
}) => {
  const quizTypes = [
    { value: QuizType.ASSIGNMENT, label: "Bài Tập Về Nhà" },
    { value: QuizType.EXAM, label: "Bài Thi Chính Thức" },
    { value: QuizType.PRACTICE, label: "Bài Luyện Tập" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (!selectedValue) {
      setSelectedQuizType(null);
      return;
    }
    const selectedOption = quizTypes.find((q) => q.value === selectedValue);
    setSelectedQuizType(selectedOption || null);
  };

  // Lấy value từ props (xử lý tùy theo cách bạn lưu state là object hay string)
  const currentValue = selectedQuizType?.value || selectedQuizType || "";

  return (
    <div className="custom-select-wrapper">
      <select
        className="form-input custom-select"
        value={typeof currentValue === 'object' ? currentValue.value : currentValue}
        onChange={handleChange}
      >
        <option value="" disabled className="placeholder-option">
          -- Chọn loại bài kiểm tra --
        </option>
        {quizTypes.map((q) => (
          <option key={q.value} value={q.value}>
            {q.label}
          </option>
        ))}
      </select>
      <div className="select-arrow"></div>
    </div>
  );
};
