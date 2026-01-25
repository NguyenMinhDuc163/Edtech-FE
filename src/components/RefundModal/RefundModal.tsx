import { useState } from "react";
import "./RefundModal.css";

interface RefundModalProps {
  open: boolean;
  daysLeft: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RefundModal({
  open,
  daysLeft,
  onConfirm,
  onCancel,
}: RefundModalProps) {
  const [reason, setReason] = useState("");
  const maxLength = 200;

  if (!open) return null;

  const handleConfirm = () => {
    if (reason.trim().length === 0) {
      return;
    }
    onConfirm(reason);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setReason(value);
    }
  };

  return (
    <div className="refund-overlay">
      <div className="refund-box">
        <h3>Yêu cầu hoàn tiền</h3>

        <div className="refund-info">
          <p className="refund-days-notice">
            Bạn còn <strong>{daysLeft} ngày</strong> để yêu cầu hoàn tiền cho khóa học này.
          </p>
          <p className="refund-warning">
            Sau khi gửi yêu cầu, admin sẽ xem xét và phê duyệt trong thời gian sớm nhất.
          </p>
        </div>

        <div className="refund-form-group">
          <label htmlFor="refund-reason">
            Lý do hoàn tiền <span className="required">*</span>
          </label>
          <textarea
            id="refund-reason"
            className="refund-textarea"
            placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn hoàn tiền..."
            value={reason}
            onChange={handleReasonChange}
            rows={4}
          />
          <div className="refund-counter">
            <span className={reason.trim().length === 0 ? "error" : ""}>
              {reason.length}/{maxLength} ký tự
            </span>
          </div>
        </div>

        <div className="refund-actions">
          <button
            className="refund-btn confirm"
            onClick={handleConfirm}
            disabled={reason.trim().length === 0}
          >
            Xác nhận
          </button>
          <button className="refund-btn cancel" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
