import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import "./AdminRefundDetail.css";
import { refundService } from "@/services/Refund/refundService";
import type { Refund } from "@/types/Refund/refund.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import RejectModal from "./components/RejectModal";

export default function AdminRefundDetail() {
  const { vnpRequestId } = useParams<{ vnpRequestId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [refund, setRefund] = useState<Refund | null>(null);
  const [approveConfirm, setApproveConfirm] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchRefundDetail = async () => {
    if (!vnpRequestId) return;
    try {
      setLoading(true);
      const data = await refundService.getRefundDetail(vnpRequestId);
      setRefund(data);
    } catch (err: any) {
      console.error("Load refund detail error:", err);
      showToast(err.response?.data?.message || "Tải chi tiết hoàn tiền thất bại", "error");
      navigate("/admin/refunds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundDetail();
  }, [vnpRequestId]);

  const handleApprove = async () => {
    if (!vnpRequestId) return;
    try {
      setLoading(true);
      const result = await refundService.approveRefunds([vnpRequestId]);
      showToast(result.message, "success");
      setApproveConfirm(false);
      navigate("/admin/refunds");
    } catch (err: any) {
      console.error("Approve refund error:", err);
      showToast(err.response?.data?.message || "Phê duyệt hoàn tiền thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!vnpRequestId) return;
    try {
      setLoading(true);
      const result = await refundService.rejectRefunds([vnpRequestId], reason);
      showToast(result.message, "success");
      setRejectModalOpen(false);
      navigate("/admin/refunds");
    } catch (err: any) {
      console.error("Reject refund error:", err);
      showToast(err.response?.data?.message || "Từ chối hoàn tiền thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PEND":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      case "SUCC":
        return "Hoàn tiền thành công";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PEND":
        return "status-pend";
      case "APPROVED":
      case "SUCC":
        return "status-success";
      case "REJECTED":
        return "status-rejected";
      default:
        return "";
    }
  };

  if (!refund) {
    return null;
  }

  return (
    <div className="refund-detail-page">
      <div className="refund-detail-container">
        <button className="back-btn" onClick={() => navigate("/admin/refunds")}>
          <ArrowLeft size={18} />
          <span>Quay lại danh sách</span>
        </button>

        <header className="refund-detail-header">
          <div>
            <h2 className="refund-detail-title">Chi tiết yêu cầu hoàn tiền</h2>
            <p className="refund-detail-id">Mã yêu cầu: {refund.vnp_request_id}</p>
          </div>
          <span className={`refund-detail-status ${getStatusClass(refund.status)}`}>
            {getStatusLabel(refund.status)}
          </span>
        </header>

        <div className="refund-detail-content">
          <section className="detail-section">
            <h3 className="section-title">Thông tin người yêu cầu</h3>
            <div className="user-info-card">
              <div className="user-avatar">
                {refund.creator.avatar_url ? (
                  <img src={refund.creator.avatar_url} alt={refund.creator.full_name} />
                ) : (
                  <div className="avatar-placeholder">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>
              <div className="user-details">
                <h4>{refund.creator.full_name || refund.creator.username}</h4>
                <div className="user-meta">
                  <p><strong>Email:</strong> {refund.creator.email}</p>
                  <p><strong>Số điện thoại:</strong> {refund.creator.phone || "Chưa cập nhật"}</p>
                  <p><strong>Username:</strong> {refund.creator.username}</p>
                </div>
              </div>
            </div>
          </section>

          {refund.payment.course && (
            <section className="detail-section">
              <h3 className="section-title">Thông tin khóa học</h3>
              <div className="course-info-card">
                <img
                  src={refund.payment.course.thumbnail_url}
                  alt={refund.payment.course.title}
                  className="course-thumbnail"
                />
                <div className="course-details">
                  <h4>{refund.payment.course.title}</h4>
                  <div className="course-meta">
                    <p><strong>Giá khóa học:</strong> {formatCurrency(refund.payment.course.price)}</p>
                    <p><strong>Giảng viên:</strong> {refund.payment.course.teacher}</p>
                    <p><strong>Thời lượng:</strong> {refund.payment.course.course_duration} giờ</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="detail-section">
            <h3 className="section-title">Chi tiết thanh toán gốc</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Mã giao dịch</span>
                <span className="info-value">{refund.payment.txn_ref}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Số tiền thanh toán</span>
                <span className="info-value">{formatCurrency(refund.payment.amount)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phương thức</span>
                <span className="info-value">{refund.payment.payment_method}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngân hàng</span>
                <span className="info-value">{refund.payment.bank_code}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày thanh toán</span>
                <span className="info-value">{formatDate(refund.payment.paid_at)}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3 className="section-title">Chi tiết hoàn tiền</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Số tiền hoàn</span>
                <span className="info-value highlight">{formatCurrency(refund.amount)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày tạo yêu cầu</span>
                <span className="info-value">{formatDate(refund.created_at)}</span>
              </div>
              {refund.approved_at && (
                <div className="info-item">
                  <span className="info-label">Ngày phê duyệt</span>
                  <span className="info-value">{formatDate(refund.approved_at)}</span>
                </div>
              )}
              {refund.refunded_at && (
                <div className="info-item">
                  <span className="info-label">Ngày hoàn tiền</span>
                  <span className="info-value">{formatDate(refund.refunded_at)}</span>
                </div>
              )}
            </div>

            <div className="reason-box">
              <h4>Lý do yêu cầu hoàn tiền</h4>
              <p>{refund.reason}</p>
            </div>

            {refund.reject_reason && (
              <div className="reason-box reject">
                <h4>Lý do từ chối</h4>
                <p>{refund.reject_reason}</p>
              </div>
            )}
          </section>
        </div>

        {refund.status === "PEND" && (
          <div className="refund-detail-actions">
            <button className="action-btn btn-reject" onClick={() => setRejectModalOpen(true)}>
              Từ chối
            </button>
            <button className="action-btn btn-approve" onClick={() => setApproveConfirm(true)}>
              Phê duyệt
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={approveConfirm}
        title="Xác nhận phê duyệt"
        message={`Bạn có chắc chắn muốn phê duyệt yêu cầu hoàn tiền ${formatCurrency(refund.amount)} cho khách hàng ${refund.creator.full_name}?`}
        onConfirm={handleApprove}
        onCancel={() => setApproveConfirm(false)}
      />

      <RejectModal
        isOpen={rejectModalOpen}
        count={1}
        onConfirm={handleReject}
        onCancel={() => setRejectModalOpen(false)}
      />
    </div>
  );
}
