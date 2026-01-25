import {
  CheckCircle2,
  ChevronRight,
  ClipboardPenLine,
  Clock,
  Info,
  SquareArrowLeft,
  XCircle,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import type { QuestionResult } from "@/types/Exam/exam.type";
import { formatDateTime } from "@/utils/date/formatDateTime";
import "./SubmitExam.css";
import { AdaptiveLearningCard } from "../../AdaptiveLearning/components/AdaptiveLearningCard";

const SubmitExam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, examId } = useParams();

  const result = location.state?.submitResult;

  const [showAnswers, setShowAnswers] = useState(false);

  // const handleGoToLesson = (targetContentId: string) => {
  //   navigate(`/student/course/${courseId}/learn/${targetContentId}`);
  // };

  const handleGoToLesson = (_targetContentId: string) => {
    navigate(`/student/learn/${courseId}`);
  };

  if (!result) {
    return (
      <div className="submit-exam-container">
        <div className="submit-exam-card">
          <div className="submit-exam-title">Không có dữ liệu bài làm</div>
        </div>
      </div>
    );
  }

  const {
    score,
    isPassed,
    passingScore,
    timeSpentMinutes,
    submittedAt,
    totalQuestions,
    correctAnswers,
    questionResults,
    adaptiveSuggestion,
  } = result;

  const incorrectCount = totalQuestions - correctAnswers;

  const handlePracticeAgain = () => {
    navigate(`/student/course/${courseId}/exams/${examId}/take`);
  };

  const handleExamListAgain = () => {
    navigate(`/student/course/${courseId}/exams`);
  };

  return (
    <div className="submit-exam-container">
      <div
        className={
          adaptiveSuggestion ? "exam-result-layout" : "exam-result-centered"
        }
      >
        <div className="result-column">
          <div className="submit-exam-card">
            <div className="submit-exam-header">
              <div className="submit-exam-title">Kết quả bài kiểm tra</div>
              <div>
                <div style={{ marginTop: 6 }}>
                  <span className="text-sm font-medium">Điểm:</span>{" "}
                  <span
                    className="submit-exam-score"
                    style={{ color: isPassed ? "#16a34a" : "#dc2626" }}
                  >
                    {score}
                  </span>
                  <span
                    style={{ marginLeft: 8, color: "#64748b", fontSize: 13 }}
                  >
                    (Điểm đạt: {passingScore})
                  </span>
                </div>
              </div>
            </div>

            <div className="submit-exam-body">
              <div className="exam-info-list">
                <div className="info-row-result">
                  <div className="info-label">
                    <Clock strokeWidth={1.5} className="size-4" />
                    Thời gian làm bài
                  </div>
                  <div className="info-value">{timeSpentMinutes} phút</div>
                </div>

                <div className="info-row-result">
                  <div className="info-label">
                    <CheckCircle2
                      strokeWidth={1.5}
                      className="size-4 text-lime-600"
                    />
                    Số câu đúng
                  </div>
                  <div className="info-value success">{correctAnswers}</div>
                </div>

                <div className="info-row-result">
                  <div className="info-label">
                    <XCircle
                      strokeWidth={1.5}
                      className="size-4 text-red-600"
                    />
                    Số câu sai
                  </div>
                  <div className="info-value error">{incorrectCount}</div>
                </div>

                <div className="info-row-result">
                  <div className="info-label">
                    <Info strokeWidth={1.5} className="size-4 text-zinc-500" />
                    Tổng số câu
                  </div>
                  <div className="info-value muted">{totalQuestions}</div>
                </div>

                <div className="info-row-result">
                  <div className="info-label">
                    <Info strokeWidth={1.5} className="size-4 text-zinc-500" />
                    Thời điểm nộp
                  </div>
                  <div className="info-value muted">
                    {formatDateTime(submittedAt)}
                  </div>
                </div>
              </div>

              <div className="submit-actions">
                <div
                  className="action-btn btn-yellows"
                  onClick={handleExamListAgain}
                >
                  <span>Quay lại</span>
                  <SquareArrowLeft strokeWidth={1.5} className="size-4" />
                </div>

                <div
                  className="action-btn btn-orange"
                  onClick={handlePracticeAgain}
                >
                  <span>Làm lại</span>
                  <ClipboardPenLine strokeWidth={1.5} className="size-4" />
                </div>

                <div
                  className="action-btn btn-blue"
                  onClick={() => setShowAnswers((s) => !s)}
                >
                  <span>{showAnswers ? "Ẩn đáp án" : "Xem đáp án"}</span>
                  <ChevronRight strokeWidth={1.5} className="size-4" />
                </div>
              </div>

              {/* Phần hiển thị đáp án chi tiết */}
              {showAnswers && (
                <div className="answers-section">
                  <h3 className="answers-title">Đáp án chi tiết</h3>
                  <div className="answers-list">
                    {questionResults.map((q: QuestionResult, idx: number) => {
                      const isCorrect = !!q.isCorrect;
                      const userText = q.userAnswer?.textAnswer;

                      return (
                        <div key={q.questionId} className="answer-item-result">
                          <div className="answer-header">
                            <span className="answer-question-number">
                              Câu {idx + 1}
                            </span>
                            {isCorrect ? (
                              <CheckCircle2 className="text-lime-600 size-5" />
                            ) : (
                              <XCircle className="text-red-600 size-5" />
                            )}
                          </div>

                          <div className="answer-question-text">
                            {q.questionText}
                          </div>

                          <div className="answer-block">
                            <div className="answer-label">Bạn chọn:</div>
                            <div className="answer-value">
                              {userText ?? "Không chọn"}
                            </div>
                          </div>

                          <div className="answer-block">
                            <div className="answer-label">Đáp án đúng:</div>
                            <div className="answer-value correct">
                              {q.correctAnswer ?? "—"}
                            </div>
                          </div>

                          <div className="answer-block">
                            <div className="answer-label">Số điểm:</div>
                            <div className="answer-value">{q.pointsEarned}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {adaptiveSuggestion && (
          <aside className="suggestion-sidebar">
            <h5 className="sidebar-heading">Bước tiếp theo</h5>

            <AdaptiveLearningCard
              data={adaptiveSuggestion}
              onNavigate={handleGoToLesson}
            />
          </aside>
        )}
      </div>
    </div>
  );
};

export default SubmitExam;
