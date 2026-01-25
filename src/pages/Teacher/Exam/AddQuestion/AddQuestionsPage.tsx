import React, { useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { QuestionItem } from "./Components/QuestionItem";
import type { Question } from "@/types/Exam/Question/question.type";
import "./style/AddQuestionsPage.css";
import { teacherExamService } from "@/services/Exam/Teacher/teacherExamService";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { FaPlus, FaSave, FaDownload, FaFileUpload } from "react-icons/fa";

export const AddQuestionsPage: React.FC = () => {
  const { courseId, examId } = useParams<{
    courseId: string;
    examId: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const location = useLocation();
  const { quiz } = location.state || {};

  const [questions, setQuestions] = useState<Question[]>([
    {
      question_text: "",
      time_limit_sec: 30,
      answers: [
        { content: "", is_correct: false },
        { content: "", is_correct: false },
      ],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        time_limit_sec: 30,
        answers: [
          { content: "", is_correct: false },
          { content: "", is_correct: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) {
      showToast("Phải có ít nhất 1 câu hỏi!", "warning");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, updated: Question) => {
    const newList = [...questions];
    newList[index] = updated;
    setQuestions(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId) return;

    const isValid = questions.every(
      (q) => q.question_text.trim() && q.answers.some((a) => a.is_correct)
    );
    if (!isValid) {
      showToast(
        "Vui lòng điền nội dung câu hỏi và chọn đáp án đúng cho tất cả câu hỏi!",
        "warning"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { quiz_id: examId, questions };
      const response = await teacherExamService.addQuestion(payload);

      if (response?.status === 201) {
        showToast("Thêm câu hỏi thành công!", "success");
        navigate(`/teacher/courses/${courseId}/exam`);
      } else {
        showToast("Thêm câu hỏi thất bại. Vui lòng thử lại.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Lỗi hệ thống.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await teacherExamService.downloadTemplate();
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quiz-template.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
      showToast("Tải file mẫu thành công!", "success");
    } catch (error) {
      console.error(error);
      showToast("Tải file mẫu thất bại!", "error");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;

    try {
      setIsUploading(true);
      const response = await teacherExamService.importQuestions(examId, file);

      if (response?.status === 200 && response?.data?.success) {
        const importedQuestions = response.data.questions.map((q: any) => ({
          question_text: q.questionText,
          time_limit_sec: 30,
          answers: q.answers.map((a: any) => ({
            content: a.content,
            is_correct: a.isCorrect,
          })),
        }));

        setQuestions(importedQuestions);
        showToast(
          `Import thành công ${response.data.summary.successCount}/${response.data.summary.totalRows} câu hỏi!`,
          "success"
        );
      } else {
        showToast("Import file thất bại!", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Import file thất bại!", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="question-page-container">
      <header className="question-page-header">
        <button className="question-btn-back" onClick={() => navigate(-1)}>
          Quay lại
        </button>
        <div className="question-header-info">
          <h1 className="question-page-title">Biên soạn câu hỏi</h1>
          <p className="question-page-subtitle">
            Đề thi: {quiz?.quizTitle || "Chưa đặt tên"}
          </p>
        </div>
        <div className="question-import-actions-grp">
          <button
            type="button"
            className="question-import-btn-dwn"
            onClick={handleDownloadTemplate}
            title="Tải file mẫu Excel"
          >
            <FaDownload />
            <span>Tải file mẫu</span>
          </button>
          <button
            type="button"
            className="question-import-btn-upl"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Nhập câu hỏi từ file Excel"
          >
            <FaFileUpload />
            <span>{isUploading ? "Đang tải..." : "Nhập từ Excel"}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportFile}
            className="question-import-file-input-hdn"
          />
        </div>
        <div className="question-count-badge">
          Tổng số: <strong>{questions.length}</strong> câu
        </div>
      </header>

      <form onSubmit={handleSubmit} className="question-form-layout">
        <div className="question-list-wrapper">
          {questions.map((q, idx) => (
            <QuestionItem
              key={idx}
              index={idx}
              question={q}
              onChange={(val) => handleUpdateQuestion(idx, val)}
              onRemove={() => handleRemoveQuestion(idx)}
            />
          ))}
        </div>

        <div className="question-sticky-footer">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="question-btn question-btn-add"
          >
            <FaPlus /> Thêm câu hỏi mới
          </button>

          <button
            type="submit"
            className="question-btn question-btn-save"
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? "Đang lưu..." : "Lưu bộ câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
};
