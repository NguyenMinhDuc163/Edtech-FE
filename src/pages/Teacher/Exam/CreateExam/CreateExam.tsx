import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuizTypeDropdown } from "./Components/QuizTypeDropdown";
import { SectionAndLessonDropdown } from "./Components/SectionAndLessonDropdown";
import { QuestionTypeDropdown } from "./Components/QuestionTypeDropdown";
import { teacherExamService } from "@/services/Exam/Teacher/teacherExamService";
import "./style/CreateExam.css";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

export default function CreateExam() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!courseId) return null;

  // --- STATE ---
  const [examName, setExamName] = useState("");
  const [examDescribe, setExamDescribe] = useState("");

  const [selectedQuizType, setSelectedQuizType] = useState<any>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Settings
  const [isUnlimitedAttempts, setIsUnlimitedAttempts] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState<any>(null);
  const [selectedPassingScore, setSelectedPassingScore] = useState<any>(null);

  // Toggles
  const [isRandomOrder, setIsRandomOrder] = useState(true);
  const [isShuffleAnswers, setIsShuffleAnswers] = useState(true);
  const [isRequired, setIsRequired] = useState(true);

  // Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLERS ---

  const handleCancel = () => {
    // Nếu chưa nhập gì thì thoát luôn, ngược lại hỏi confirm
    if (!examName && !examDescribe) {
      navigate(-1);
    } else {
      setShowCancelModal(true);
    }
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate(-1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // 1. Validate
    if (!examName.trim()) {
      showToast("Vui lòng nhập tên đề thi!", "warning");
      return;
    }
    if (!selectedQuizType || !selectedQuestionType || !selectedLesson) {
      showToast("Vui lòng chọn đầy đủ loại đề và bài học!", "warning");
      return;
    }

    // 2. Prepare Payload
    const finalMaxAttempts = isUnlimitedAttempts ? 999 : maxAttempts; // 0 quy ước là không giới hạn

    const payload = {
      quiz_title: examName.trim(),
      course_content: selectedLesson.lessonId,
      quiz_type: selectedQuizType.value,
      question_type: selectedQuestionType.value,
      quiz_description: examDescribe,
      max_attempts: finalMaxAttempts,
      is_random_order: isRandomOrder,
      is_shuffle_answers: isShuffleAnswers,
      is_required: isRequired,
      passing_score: selectedPassingScore,
    };

    // 3. Call API
    try {
      setIsSubmitting(true);
      const response = await teacherExamService.createExam(payload);
      console.log(response);
      const data = response.data;
      if (response?.status === 201) {
        showToast("Tạo bài kiểm tra thành công!", "success");
        // Chuyển sang trang thêm câu hỏi
        navigate(`/teacher/courses/${courseId}/exam/${data.quizId}/question`, {
          state: { quiz: data },
        });
      } else {
        showToast(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Lỗi hệ thống. Vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttemptsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Cho phép xóa trắng để gõ lại
    if (value === "") {
      setMaxAttempts("" as any); // Tạm thời ép kiểu để UI rỗng
      return;
    }

    // Chỉ cho phép nhập số
    if (!/^\d+$/.test(value)) return;

    const numValue = parseInt(value, 10);

    // Validate Max (ví dụ max là 20 lần)
    if (numValue > 20) {
      showToast("Số lần làm bài tối đa cho phép là 20 lần!", "warning");
      setMaxAttempts(20);
    } else {
      setMaxAttempts(numValue);
    }
  };

  // Validate khi người dùng nhập xong và click ra ngoài
  const handleAttemptsBlur = () => {
    // Nếu để trống hoặc = 0 thì reset về 1
    if (maxAttempts === "" || Number(maxAttempts) < 1) {
      showToast("Số lần làm bài tối thiểu là 1.", "info");
      setMaxAttempts(1);
    }
  };

  // Xử lý thay đổi điểm đạt
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setSelectedPassingScore("" as any);
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const numValue = parseInt(value, 10);

    // Validate Điểm (Max 100)
    if (numValue > 100) {
      showToast("Điểm đạt tối đa là 100%!", "warning");
      setSelectedPassingScore(100);
    } else {
      setSelectedPassingScore(numValue);
    }
  };

  // Validate điểm khi blur
  const handleScoreBlur = () => {
    if (selectedPassingScore === "") {
      setSelectedPassingScore(0); // Mặc định về 0 nếu rỗng
    }
  };

  return (
    <div className="create-exam-page">
      <div className="create-exam-container">
        <header className="page-header">
          <h1 className="page-title">Thiết lập đề thi mới</h1>
          <p className="page-subtitle">
            Cấu hình thông tin cơ bản cho bài kiểm tra
          </p>
        </header>

        <form onSubmit={handleSubmit} className="exam-form-card">
          {/* SECTION 1: THÔNG TIN CƠ BẢN */}
          <div className="form-section">
            <h3 className="section-title">Thông tin chung</h3>

            <div className="form-group">
              <label className="form-label required">Tên đề thi</label>
              <input
                type="text"
                className="form-input"
                value={examName}
                placeholder="Ví dụ: Kiểm tra cuối chương 1..."
                onChange={(e) => setExamName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label required">Loại bài thi</label>
                <QuizTypeDropdown
                  selectedQuizType={selectedQuizType}
                  setSelectedQuizType={setSelectedQuizType}
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Loại câu hỏi</label>
                <QuestionTypeDropdown
                  selectedQuestionType={selectedQuestionType}
                  setSelectedQuestionType={setSelectedQuestionType}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Gán vào bài học</label>
              <SectionAndLessonDropdown
                courseId={courseId}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả / Hướng dẫn</label>
              <textarea
                className="form-textarea"
                placeholder="Nhập hướng dẫn làm bài cho học viên..."
                value={examDescribe}
                onChange={(e) => setExamDescribe(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* SECTION 2: CẤU HÌNH NÂNG CAO */}
          <div className="form-section border-top">
            <h3 className="section-title">Cấu hình làm bài</h3>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Số lần làm tối đa</label>
                <div className="input-with-checkbox">
                  <input
                    type="text"
                    inputMode="numeric" // Hiện phím số trên mobile
                    className="form-input text-center"
                    placeholder="1-20"
                    value={isUnlimitedAttempts ? "" : maxAttempts}
                    onChange={handleAttemptsChange}
                    onBlur={handleAttemptsBlur}
                    disabled={isUnlimitedAttempts}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isUnlimitedAttempts}
                      onChange={(e) => {
                        setIsUnlimitedAttempts(e.target.checked);
                        if (!e.target.checked) setMaxAttempts(1); // Reset về 1 khi bỏ tích
                      }}
                    />
                    Không giới hạn
                  </label>
                </div>
              </div>

              {/* Cấu hình điểm đạt */}
              <div className="form-group">
                <label className="form-label">Điểm đạt (%)</label>
                <div className="input-suffix-wrapper">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input text-center"
                    placeholder="0-100"
                    value={selectedPassingScore}
                    onChange={handleScoreChange}
                    onBlur={handleScoreBlur}
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Toggles Switch */}
            <div className="toggles-container">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={isRandomOrder}
                  onChange={(e) => setIsRandomOrder(e.target.checked)}
                />
                <span className="toggle-text">Đảo ngẫu nhiên câu hỏi</span>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={isShuffleAnswers}
                  onChange={(e) => setIsShuffleAnswers(e.target.checked)}
                />
                <span className="toggle-text">Đảo thứ tự đáp án</span>
              </label>

              <label className="toggle-row">
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
                <span className="toggle-text">Bắt buộc hoàn thành</span>
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="form-footer">
            <button
              type="button"
              className="btn exam-btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Tiếp tục"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal xác nhận hủy */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Hủy tạo đề thi?</h3>
            <p>
              Mọi thông tin bạn đã nhập sẽ bị mất. Bạn có chắc chắn muốn thoát
              không?
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Ở lại
              </button>
              <button className="btn btn-danger" onClick={confirmCancel}>
                Hủy và Thoát
              </button>
            </div>
          </div>
        </div>
      )}
      <FloatingBackButton/>
    </div>
  );
}
