import { useState } from "react";
import "./RejectModal.css";

interface RejectModalProps {
  isOpen: boolean;
  count: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const MAX_LENGTH = 200;

export default function RejectModal({ isOpen, count, onConfirm, onCancel }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }
    if (reason.length > MAX_LENGTH) {
      setError(`Lý do không được vượt quá ${MAX_LENGTH} ký tự`);
      return;
    }
    onConfirm(reason);
    setReason("");
    setError("");
  };

  const handleCancel = () => {
    setReason("");
    setError("");
    onCancel();
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    setError("");
  };

  return (
    <div className="reject-modal-overlay" onClick={handleCancel}>
      <div className="reject-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="reject-modal-title">Từ chối yêu cầu hoàn tiền</h3>

        <p className="reject-modal-subtitle">
          Bạn đang từ chối <strong>{count}</strong> yêu cầu hoàn tiền. Vui lòng nhập lý do từ chối.
        </p>

        <div className="reject-modal-form">
          <label className="reject-modal-label">
            Lý do từ chối <span className="required">*</span>
          </label>
          <textarea
            className={`reject-modal-textarea ${error ? "error" : ""}`}
            placeholder="Nhập lý do từ chối..."
            value={reason}
            onChange={handleReasonChange}
            rows={4}
            maxLength={MAX_LENGTH}
          />
          <div className="reject-modal-footer-info">
            <span className={`character-counter ${reason.length >= MAX_LENGTH ? "max" : ""}`}>
              {reason.length}/{MAX_LENGTH}
            </span>
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>

        <div className="reject-modal-actions">
          <button className="reject-modal-btn reject-modal-btn-cancel" onClick={handleCancel}>
            Hủy
          </button>
          <button className="reject-modal-btn reject-modal-btn-confirm" onClick={handleConfirm}>
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
