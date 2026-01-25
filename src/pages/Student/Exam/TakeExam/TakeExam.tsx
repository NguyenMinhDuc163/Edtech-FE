import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TakeExam.css";

import { TakeExamHeader } from "./Layout/TakeExamHeader";
import { TakeExamArea } from "./Layout/TakeExamArea";
import { QuestionBar } from "./Layout/QuestionBar";

import type {
  Exam,
  Question,
  ExamAnswer,
  ExamAttemptResponse,
} from "../../../../types/Exam/exam.type";

import { studentExamService } from "@/services/Exam/Student/studentExamService";
import { useLoadingStore } from "@/store/loadingStore";
import SkeletonCourseList from "@/components/NotFoundData/notFound";

const TakeExam = () => {
  const navigate = useNavigate();

  const { courseId, examId } = useParams<{
    courseId: string;
    examId: string;
  }>();

  const [exam, setExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loading = useLoadingStore((state) => state.isLoading);

  useEffect(() => {
    if (!examId) return;

    const payload = { quiz_id: examId };

    const fetchData = async () => {
      try {
        const res: ExamAttemptResponse = await studentExamService.getDetailExam(
          payload
        );

        setExam({
          quizInfo: res.quizInfo,
          questions: res.questions,
        });

        setQuestions(res.questions);
      } catch (err) {
        console.error("Lỗi khi load đề thi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleFinish = async () => {
    if (!exam) return;

    const payload = {
      quiz_id: exam.quizInfo.quizId,
      answers: examAnswers.map((ans) => ({
        question_id: ans.questionId,
        answer_id: ans.answerId,
      })),
    };

    try {
      const res = await studentExamService.submitExam(payload);

      navigate(`/student/course/${courseId}/exams/${examId}/result`, {
        state: { submitResult: res },
      });
    } catch (error) {
      console.error("Lỗi nộp bài:", error);
    }
  };

  if (loading) {
    return <SkeletonCourseList count={8} />;
  }

  if (!exam) {
    return (
      <div className="loading-panel text-red-600">Không tìm thấy đề thi</div>
    );
  }

  return (
    <div>
      <TakeExamHeader exam={exam} handleFinish={handleFinish} />

      <div className="take-grid">
        <TakeExamArea
          questions={exam.questions}
          examAnswers={examAnswers}
          setExamAnswers={setExamAnswers}
        />

        <QuestionBar questions={questions} examAnswers={examAnswers} />
      </div>
    </div>
  );
};

export default TakeExam;
