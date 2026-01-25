import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, Timer, ListChecks } from "lucide-react";
import { studentExamService } from "@/services/Exam/Student/studentExamService";
import type { ExamViewData } from "@/types/Exam/exam.type";
import "./style/ExamViewPage.css";
import { useLoadingStore } from "@/store/loadingStore";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

const ExamViewPage = () => {
  const { examId } = useParams();
  const [examView, setExamView] = useState<ExamViewData | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchExam = async () => {
    try {
      if (!examId) return;
      const payload = { quiz_id: examId };
      const res = await studentExamService.getDetailExam(payload);
      setExamView(res.data ?? res);
    } catch (err) {
      console.error("Fetch exam view failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examId) fetchExam();
  }, [examId]);

//   const goTakeExam = () => {
//     navigate(`/student/course/${courseId}/exams/${examId}/take`);
//   };
  if (!examView) {
    return (
      <div className="exam-view-container">
        <div className="exam-view-card">Không tìm thấy đề thi</div>
      </div>
    );
  }

  const { quizInfo, questions } = examView;

  return (
    <div className="examview-container">
      <div className="examview-card">
        <div className="examview-header">
          <div className="examview-title">
            <BookOpen className="icon" />
            {quizInfo.quizTitle}
          </div>

          <div className="examview-description">{quizInfo.quizDescription}</div>
        </div>

        <div className="examview-info-box">
          <div className="examview-info-row">
            <span className="label">Loại bài:</span>
            <span>{quizInfo.quizType}</span>
          </div>
          <div className="examview-info-row">
            <span className="label">Điểm đạt tối thiểu:</span>
            <span>{quizInfo.passingScore}</span>
          </div>
          <div className="examview-info-row">
            <span className="label">Số lần được làm:</span>
            <span>{quizInfo.maxAttempts}</span>
          </div>
          <div className="examview-info-row">
            <span className="label">Lần còn lại:</span>
            <span>{quizInfo.remainingAttempts}</span>
          </div>
          <div className="examview-info-row">
            <span className="label">Bắt buộc làm:</span>
            <span>{quizInfo.isRequired ? "Có" : "Không"}</span>
          </div>
        </div>

        <div className="examview-question-section">
          <h3 className="examview-question-title">
            <ListChecks className="icon" /> Danh sách câu hỏi
          </h3>

          <div className="examview-question-list">
            {questions.map((q, idx) => (
              <div key={q.questionId} className="examview-question-item">
                <div className="examview-question-header">
                  <div className="examview-question-index">Câu {idx + 1}</div>
                  <div className="examview-question-time">
                    <Timer className="icon" />
                    {q.timeLimitSec}s
                  </div>
                </div>

                <div className="examview-question-text">{q.questionText}</div>

                <div className="examview-answer-list">
                  {q.answers.map((answer, aIdx) => (
                    <div key={answer.answerId} className="answer-item">
                      <div className="answer-prefix">
                        {String.fromCharCode(65 + aIdx)}.
                      </div>
                      <div className="answer-content">{answer.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="examview-actions">
          {/* <button className="examview-btn-start" onClick={goTakeExam}>
            Bắt đầu làm bài
          </button> */}
        </div>
      </div>
      <FloatingBackButton />
    </div>
  );
};

export default ExamViewPage;
