import { QrCode } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { studentExamService } from "@/services/Exam/Student/studentExamService";
import PreviewExamInfo from "./Layout/PreviewExamInfo";
import "./previewExam.css";
import ExamLocked from "./Layout/ExamLocked";
import { useLoadingStore } from "@/store/loadingStore";
import SkeletonCourseList from "@/components/NotFoundData/notFound";

const PreviewExam: React.FC = () => {
  const { courseId, examId } = useParams<{
    courseId: string;
    examId: string;
  }>();

  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loading = useLoadingStore((state) => state.isLoading);

  useEffect(() => {
    if (!examId) return;

    const payload = { quiz_id: examId };

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await studentExamService.getDetailExam(payload);
        setData(res?.quizInfo);
      } catch (err) {
        console.error("Preview exam error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  // const handleStartExam = () => {
  //   if (!examId) return;
  //   navigate(`/student/exam/${examId}/identify-student`);
  // };

  const handleStartExam = () => {
    if (!examId) return;
    navigate(`/student/course/${courseId}/exams/${examId}/take`);
  };

  if (loading) {
    return  <SkeletonCourseList count={8} />;
  }

  if (!data) {
    return <ExamLocked />;
  }

  return (
    <div className="preview-exam-container">
      <div className="preview-exam-card">
        <div className="exam-header">
          <div className="exam-title">{data.quizTitle}</div>

          <div className="exam-hash">
            <span className="exam-hash-text">Mã đề: {data.quizId}</span>
            <QrCode strokeWidth={1.4} className="icon" />
          </div>
        </div>

        <PreviewExamInfo quizInfo={data} />

        <button className="start-btn" onClick={() => handleStartExam()}>
          Bắt đầu
        </button>
      </div>
    </div>
  );
};

export default PreviewExam;
