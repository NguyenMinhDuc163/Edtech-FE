import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teacherExamService } from "@/services/Exam/Teacher/teacherExamService";
import "./style/ExamDetailPage.css";
import type { QuizDetailResponse } from "@/types/Exam/examDetail.type";
import { ExamInfoCard } from "./components/ExamInfoCard";
import { QuestionItem } from "./components/QuestionItem";
import { useLoadingStore } from "@/store/loadingStore";

export const ExamDetailPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [quizDetail, setQuizDetail] = useState<QuizDetailResponse | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizDetail = async () => {
      if (!examId) return;
      setLoading(true);
      try {
        const data = await teacherExamService.getExamById(examId);
        if (data) {
          setQuizDetail(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đề thi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetail();
  }, [examId]);

  if (!quizDetail)
    return <p className="error-text">Không tìm thấy dữ liệu đề thi.</p>;

  const { quizInfo, questions } = quizDetail;

  return (
    <div className="exam-detail-container">
      <div className="exam-detail-header">
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
        <h2>Chi tiết đề thi</h2>
      </div>

      <ExamInfoCard info={quizInfo} />

      <div className="question-section">
        <h3>Danh sách câu hỏi ({questions.length})</h3>
        {questions.map((q, index) => (
          <QuestionItem key={q.questionId} question={q} index={index + 1} />
        ))}
      </div>
    </div>
  );
};
