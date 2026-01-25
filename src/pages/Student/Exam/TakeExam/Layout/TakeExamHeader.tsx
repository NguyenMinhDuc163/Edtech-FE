import { useEffect, useRef, useState } from "react";
import {
  Timer,
  ZoomIn,
  ZoomOut,
  Maximize,
  FilePenLine,
  ChevronLeft,
} from "lucide-react";
import { useCountDown } from "../../../../../hooks/Exam/useCountDown";
import type { Exam } from "../../../../../types/Exam/exam.type";
import useGoBack from "@/hooks/useGoBack";
import { useAuthStore } from "@/store/authStore";

interface Props {
  exam: Exam;
  handleFinish: () => Promise<void>;
}

export const TakeExamHeader: React.FC<Props> = ({ exam, handleFinish }) => {
  const goBack = useGoBack();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const userName = useAuthStore().userName;
  const hasAutoSubmitted = useRef(false);
  const totalDuration = exam.questions.reduce(
    (sum, q) => sum + (q.timeLimitSec || 0),
    0
  );

  const timeLeft = useCountDown(totalDuration);
  const [zoom, setZoom] = useState<number>(100);

  const onSubmitExam = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn nộp bài không?")) return;

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await handleFinish();
    } catch (err: any) {
      setSubmitError(
        err?.message || "Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại."
      );
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const isTimeUp =
      timeLeft.hours === "00" &&
      timeLeft.minutes === "00" &&
      timeLeft.seconds === "00";

    const isAlreadyExpired = totalDuration <= 0;

    if ((isTimeUp || isAlreadyExpired) && !hasAutoSubmitted.current) {
      console.log("Thời gian đã hết, đang tự động nộp bài...");

      hasAutoSubmitted.current = true;
      setIsSubmitting(true);

      handleFinish()?.catch((err: any) => {
        setSubmitError(
          "Lỗi nộp bài tự động: " + (err?.message || "Unknown error")
        );
        setIsSubmitting(false);
      });
    }
  }, [timeLeft, totalDuration, handleFinish]);

  if (totalDuration <= 0 && !submitError) {
    return (
      <div className="exam-timeout-container">
        <div className="exam-timeout-content">
          <Timer className="exam-timeout-icon" />
          <span>Thời gian làm bài đã hết. Hệ thống đang thu bài...</span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Bài làm sẽ không được lưu nếu bạn rời đi.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Bạn đang làm bài thi. Rời khỏi trang này sẽ bị tính là hủy bài làm/nộp bài. Bạn có chắc chắn không?"
      );

      if (confirmLeave) {
        goBack();
      } else {
        history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [goBack]);

  const handleUiBack = () => {
    if (isSubmitting) return;

    const confirmLeave = window.confirm(
      "Cảnh báo: Rời khỏi màn hình này sẽ dừng bài thi. Bạn có chắc chắn muốn thoát?"
    );
    if (confirmLeave) {
      goBack();
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 80));

  useEffect(() => {
    const examContent = document.getElementById("exam-content");
    if (examContent) {
      examContent.style.transition = "transform 0.2s ease";
      examContent.style.transform = `scale(${zoom / 100})`;
      examContent.style.transformOrigin = "top center";
    }
  }, [zoom]);

  return (
    <>
      {submitError && (
        <div className="submit-error-panel">
          <div className="error-title">Nộp bài thất bại</div>
          <div className="error-message">{submitError}</div>
          <button className="error-back-btn" onClick={handleUiBack}>
            Thoát ra
          </button>
        </div>
      )}

      <div className={`take-header ${isSubmitting ? "disabled" : ""}`}>
        <button
          onClick={handleUiBack}
          className="header-btn-back"
          disabled={isSubmitting}
        >
          <ChevronLeft strokeWidth={1.8} />
          <span>Quay lại</span>
        </button>

        <div className="header-candidate">Thí sinh: {userName}</div>

        <div className="header-timer">
          <Timer strokeWidth={1.5} className="timer-icon" />
          {isSubmitting ? (
            <div className="timer-text">Đang nộp bài...</div>
          ) : totalDuration === 0 ? (
            <div className="timer-text">Không giới hạn thời gian</div>
          ) : (
            <div className="timer-text">
              {`${timeLeft.hours} : ${timeLeft.minutes} : ${timeLeft.seconds}`}
            </div>
          )}
        </div>

        <div className="header-actions">
          <div className="zoom-group">
            <button
              disabled={isSubmitting}
              onClick={handleZoomOut}
              className="zoom-btn"
            >
              <ZoomOut strokeWidth={1.5} />
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleZoomIn}
              className="zoom-btn"
            >
              <ZoomIn strokeWidth={1.5} />
            </button>
          </div>

          <button
            disabled={isSubmitting}
            onClick={() => setZoom(100)}
            className="zoom-btn"
          >
            <Maximize strokeWidth={1.5} />
          </button>

          <div
            onClick={!isSubmitting ? onSubmitExam : undefined}
            className={`actions-submit ${isSubmitting ? "disabled" : ""}`}
          >
            <FilePenLine className="submit-icon" strokeWidth={1.5} />
            <div className="submit-text">
              {isSubmitting ? "Đang nộp..." : "Nộp bài"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
