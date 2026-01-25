import useGoBack from "@/hooks/useGoBack";
import "../style/ExamLocked.css";

export default function ExamLocked() {
  const goBack = useGoBack();

  return (
    <div className="exam-locked-container">
      <div className="exam-locked-card">
        <h2>Không thể bắt đầu bài thi</h2>
        <p>
          Bạn đã hết lượt làm bài hoặc bài thi hiện chưa được mở.
          <br />
          Vui lòng liên hệ giáo viên để được hỗ trợ.
        </p>

        <button className="back-button" onClick={goBack}>
          Quay về
        </button>
      </div>
    </div>
  );
}
