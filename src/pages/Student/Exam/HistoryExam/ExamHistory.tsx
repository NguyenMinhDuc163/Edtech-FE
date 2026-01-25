import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { studentExamService } from "@/services/Exam/Student/studentExamService";
import type { ExamHistoryItem } from "@/types/Exam/exam.type";
import { formatDateTime } from "@/utils/date/formatDateTime";
import "./style/ExamHistory.css";
import { useLoadingStore } from "@/store/loadingStore";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

const ExamHistory = () => {
  const navigate = useNavigate();
  const { courseId, examId } = useParams();
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    if (!examId) return;

    const fetchHistory = async () => {
      try {
        const payload = { quiz_id: examId };
        const resfetchHistory = await studentExamService.getExamHistory(
          payload
        );

        setHistory(resfetchHistory);
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [examId]);

  //   const goToDetail = (resultId: string) => {
  //     navigate(`/student/course/${courseId}/exam/${examId}/result/${resultId}`);
  //   };

  const goTakeAgain = () => {
    navigate(`/student/course/${courseId}/exams/${examId}/take`);
  };

  const goPreview = () => {
    navigate(`/student/course/${courseId}/exams/${examId}/view`);
  };

  if (history.length === 0) {
    return (
      <div className="exam-history-container">
        <div className="exam-history-card">
          <div className="history-title">Lịch sử làm bài</div>
          <div>Chưa có lần làm nào</div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-history-container">
      <div className="exam-history-card">
        <div className="history-actions-top">
          <button className="exam-action-btn btn-blue" onClick={goPreview}>
            <BookOpen /> Xem đề thi
          </button>
          <button className="exam-action-btn btn-orange" onClick={goTakeAgain}>
            <RefreshCw /> Làm lại
          </button>
        </div>
        <div className="history-title">Lịch sử làm bài</div>

        <div className="exam-history-list">
          {history.map((item) => (
            <div key={item.resultId} className="exam-history-item">
              <div className="history-left">
                <div className="attempt-number">Lần {item.attemptNumber}</div>

                <div className="history-row">
                  <Clock className="exam-icon" />
                  <span>Bắt đầu: {formatDateTime(item.startedAt)}</span>
                </div>

                <div className="history-row">
                  <Clock className="exam-icon" />
                  <span>Kết thúc: {formatDateTime(item.completedAt)}</span>
                </div>

                <div className="history-row">
                  <span>Thời gian làm:</span>
                  <span>{item.timeSpentMinutes} phút</span>
                </div>

                <div className="history-row">
                  <span>Kết quả:</span>
                  {item.isPassed ? (
                    <span className="passed">
                      <CheckCircle2 className="exam-icon-passed" /> Đạt
                    </span>
                  ) : (
                    <span className="failed">
                      <XCircle className="exam-icon-failed" /> Trượt
                    </span>
                  )}
                </div>

                <div className="history-row">
                  <span>Điểm:</span>
                  <span className="score-text">{item.score}</span>
                </div>
              </div>

              {/* <div
                className="history-action"
                onClick={() => goToDetail(item.resultId)}
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="icon" />
              </div> */}
            </div>
          ))}
        </div>
      </div>
      <FloatingBackButton/>
    </div>
  );
};

export default ExamHistory;
