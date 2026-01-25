import { useSearchParams, useNavigate } from "react-router-dom";
import "./style/PaymentResult.css";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status"); // success | failed
  const txnRef = searchParams.get("txnRef");
  const code = searchParams.get("code");
  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess && txnRef) {
      // TODO: Call API
    }
  }, [isSuccess, txnRef]);

  if (!status) {
    return (
      <div className="payment-result-wrapper">
        <div className="payment-result-container">
          <div className="payment-result-card">
            <div className="payment-result-icon">
              <AlertCircle size={80} className="icon-warning" />
            </div>
            <h1 className="payment-result-title">Lỗi không xác định</h1>
            <p className="payment-result-message">
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            <div className="payment-result-actions">
              <button
                className="btn-secondary-large"
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getErrorMessage = (code: string | null) => {
    if (!code || code === "00") return "";
    const messages: Record<string, string> = {
      "24": "Bạn đã hủy giao dịch",
      "97": "Chữ ký không hợp lệ",
    };
    return messages[code] || `Mã lỗi: ${code}`;
  };

  return (
    <div className="payment-result-wrapper">
      <div className="payment-result-container">
        <div className="payment-result-card">
          <h1 className="payment-result-title">
            {isSuccess
              ? "Thanh toán thành công!"
              : "Thanh toán không thành công"}
          </h1>
          <p className="payment-result-message">
            {isSuccess ? (
              <>
                Cảm ơn bạn đã thanh toán. Khóa học đã được mở khóa thành công!
              </>
            ) : (
              <>
                Rất tiếc, giao dịch của bạn chưa thành công. Vui lòng thử lại
                hoặc liên hệ hỗ trợ.
                {code && code !== "00" && (
                  <span className="payment-error-code">
                    <AlertCircle size={16} /> {getErrorMessage(code)}
                  </span>
                )}
              </>
            )}
          </p>
          {txnRef && (
            <div className="payment-result-info">
              <p>
                <strong>Mã giao dịch:</strong> {txnRef}
              </p>
            </div>
          )}
          <div className="payment-result-actions">
            {isSuccess ? (
              <button
                className="btn-primary-large"
                onClick={() => navigate("/student/learn")}
              >
                Vào học ngay
              </button>
            ) : (
              <button
                className="btn-primary-large"
                onClick={() => navigate("/help")}
              >
                Liên hệ hỗ trợ
              </button>
            )}
            <button
              className="btn-secondary-large"
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
