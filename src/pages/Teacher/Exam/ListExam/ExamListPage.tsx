import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teacherExamService } from "@/services/Exam/Teacher/teacherExamService";
import type { ExamItem } from "@/types/Exam/exam.type";
import { ExamListItem } from "./Components/ExamListItem";
import "./style/ExamListPage.css";
import { useLoadingStore } from "@/store/loadingStore";
import SkeletonCourseList from "@/components/NotFoundData/notFound";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

export const ExamListPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loading = useLoadingStore((state) => state.isLoading);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        if (!courseId) return;

        const getExamsPayload = { courseId };
        const data = await teacherExamService.getExams(getExamsPayload);

        if (Array.isArray(data)) setExams(data);
      } catch (err) {
        showToast("Lỗi khi tải danh sách đề thi", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [courseId]);

  if (loading) {
    return <SkeletonCourseList count={8} />;
  }

  return (
    <div className="exam-list-container">
      <div className="exam-list-header">
        <h2>Danh sách đề thi</h2>
        <button
          className="btn create-btn"
          onClick={() => navigate(`/teacher/courses/${courseId}/exam/create`)}
        >
          Tạo đề thi mới
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có đề thi nào.</p>
          <button
            className="btn primary-btn"
            onClick={() => navigate(`/teacher/courses/${courseId}/exam/create`)}
          >
            Tạo đề thi đầu tiên
          </button>
        </div>
      ) : (
        <div className="exam-list-grid">
          {exams.map((exam) => (
            <ExamListItem key={exam.quizId} exam={exam} />
          ))}
        </div>
      )}
      <FloatingBackButton/>
    </div>
  );
};
