import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCourseApprovalService } from "@/services/Course/adminCourseApprovalService";
import { useToast } from "@/components/Notification/common/ToastProvider";
import "./AdminApprovalActions.css";
import { useLoadingStore } from "@/store/loadingStore";

interface CourseApproveActionsProps {
  courseId: string;
  redirectPath?: string;
  onSuccess?: () => void;
}

export default function CourseApproveActions({
  courseId,
  redirectPath = "/admin/courses/approve",
  onSuccess,
}: CourseApproveActionsProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      await adminCourseApprovalService.approve(Number(courseId));
      showToast("Duyệt khóa học thành công!", "success");
      onSuccess?.();
      navigate(redirectPath);
    } catch {
      showToast("Duyệt khóa học thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showToast("Vui lòng điền lý do từ chối!", "warning");
      return;
    }
    if (isRejecting) return;

    try {
      setIsRejecting(true);
      await adminCourseApprovalService.reject(Number(courseId), rejectReason);
      showToast("Khóa học đã bị từ chối!", "info");
      onSuccess?.();
      navigate(redirectPath);
    } catch {
      showToast("Từ chối không thành công!", "error");
    } finally {
      setIsRejecting(false);
      setLoading(false);
      setShowRejectModal(false);
    }
  };

  return (
    <div className="ApproveAction__container">
      <button
        className="ApproveAction__btn ApproveAction__btn--approve"
        onClick={handleApprove}
        disabled={isRejecting}
      >
        Phê duyệt
      </button>

      <button
        className="ApproveAction__btn ApproveAction__btn--reject"
        onClick={() => setShowRejectModal(true)}
        disabled={isRejecting}
      >
        Từ chối
      </button>

      {showRejectModal && (
        <div
          className="ApproveAction__modalBackdrop"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="ApproveAction__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="ApproveAction__modalTitle">
              Xác nhận Từ chối Khóa học
            </h3>
            <textarea
              className="ApproveAction__textarea"
              placeholder="Nhập lý do từ chối (Bắt buộc)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="ApproveAction__modalActions">
              <button
                className="ApproveAction__modalBtn ApproveAction__modalBtn--cancel"
                onClick={() => setShowRejectModal(false)}
                disabled={isRejecting}
              >
                Hủy
              </button>
              <button
                className="ApproveAction__modalBtn ApproveAction__modalBtn--confirm"
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? "Đang xử lý..." : "Xác nhận Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
