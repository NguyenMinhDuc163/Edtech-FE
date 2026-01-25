import "./ConfirmDialog.css";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: any) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn danger" onClick={onConfirm}>
            Xác nhận
          </button>
          <button className="confirm-btn" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
