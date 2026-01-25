import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, CreditCard, User, BookOpen } from "lucide-react";
import "./AdminPaymentDetail.css";
import { paymentService } from "@/services/Payment/paymentService";
import type { PaymentDetail } from "@/types/Payment/payment.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";

export default function AdminPaymentDetail() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [payment, setPayment] = useState<PaymentDetail | null>(null);

  const fetchPaymentDetail = async () => {
    if (!paymentId) return;
    try {
      setLoading(true);
      const data = await paymentService.getPaymentDetail(paymentId);
      setPayment(data);
    } catch (err: any) {
      console.error("Load payment detail error:", err);
      showToast(err.response?.data?.message || "Tải chi tiết thanh toán thất bại", "error");
      navigate("/admin/payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetail();
  }, [paymentId]);

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
    const statusMap: Record<string, string> = {
      SUCCESS: "Thành công",
      FAILED: "Thất bại",
      PENDING: "Chờ xử lý",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getRefundStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PEND: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Từ chối",
      SUCC: "Hoàn tiền thành công",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "invoice-status-success";
      case "FAILED":
      case "CANCELLED":
        return "invoice-status-failed";
      case "PENDING":
        return "invoice-status-pending";
      default:
        return "";
    }
  };

  const getRefundStatusClass = (status: string) => {
    switch (status) {
      case "SUCC":
      case "APPROVED":
        return "refund-status-success";
      case "REJECTED":
        return "refund-status-rejected";
      case "PEND":
        return "refund-status-pending";
      default:
        return "";
    }
  };

  if (!payment) {
    return null;
  }

  return (
    <div className="invoice-page">
      <div className="invoice-actions-top">
        <button className="back-btn" onClick={() => navigate("/admin/payments")}>
          <ArrowLeft size={18} />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      <div className="invoice-container">
        <div className="invoice-header">
          <div className="invoice-header-left">
            <div className="invoice-logo">
              <FileText size={40} />
            </div>
            <div className="invoice-company">
              <h1>EdTech Platform</h1>
              <p>Nền tảng học trực tuyến</p>
            </div>
          </div>
          <div className="invoice-header-right">
            <h2 className="invoice-title">HÓA ĐƠN THANH TOÁN</h2>
            <div className="invoice-meta">
              <div className="invoice-meta-item">
                <span className="meta-label">Mã giao dịch:</span>
                <span className="meta-value">{payment.txn_ref}</span>
              </div>
              <div className="invoice-meta-item">
                <span className="meta-label">Số giao dịch:</span>
                <span className="meta-value">#{payment.transaction_no}</span>
              </div>
              <div className="invoice-meta-item">
                <span className="meta-label">Ngày thanh toán:</span>
                <span className="meta-value">{formatDate(payment.paid_at)}</span>
              </div>
            </div>
            <div className={`invoice-status ${getStatusClass(payment.status)}`}>
              {getStatusLabel(payment.status)}
            </div>
          </div>
        </div>

        <div className="invoice-divider"></div>

        <div className="invoice-body">
          <div className="invoice-section">
            <div className="section-icon">
              <User size={20} />
            </div>
            <h3 className="section-title">Thông tin người mua</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Họ và tên:</span>
                <span className="info-value">{payment.buyer.full_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{payment.buyer.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Số điện thoại:</span>
                <span className="info-value">{payment.buyer.phone}</span>
              </div>
            </div>
          </div>

          <div className="invoice-section">
            <div className="section-icon">
              <BookOpen size={20} />
            </div>
            <h3 className="section-title">Thông tin khóa học</h3>
            <div className="course-detail">
              <img
                src={payment.course.thumbnail_url}
                alt={payment.course.title}
                className="course-thumbnail-large"
              />
              <div className="course-detail-info">
                <h4 className="course-title-large">{payment.course.title}</h4>
                <div className="course-meta-grid">
                  <div className="info-row">
                    <span className="info-label">Giảng viên:</span>
                    <span className="info-value">{payment.course.teacher}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Giá khóa học:</span>
                    <span className="info-value price">{formatCurrency(payment.course.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-section">
            <div className="section-icon">
              <CreditCard size={20} />
            </div>
            <h3 className="section-title">Chi tiết thanh toán</h3>
            <div className="payment-details">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Mô tả</th>
                    <th className="text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{payment.course.title}</td>
                    <td className="text-right">{formatCurrency(payment.amount)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>Tổng cộng</strong></td>
                    <td className="text-right total-amount">{formatCurrency(payment.amount)}</td>
                  </tr>
                </tfoot>
              </table>
              <div className="payment-method-info">
                <div className="info-row">
                  <span className="info-label">Phương thức thanh toán:</span>
                  <span className="info-value">{payment.payment_method}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngân hàng:</span>
                  <span className="info-value">{payment.bank_code}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày tạo:</span>
                  <span className="info-value">{formatDate(payment.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {payment.refunds && payment.refunds.length > 0 && (
            <div className="invoice-section refund-section">
              <div className="section-icon">
                <Calendar size={20} />
              </div>
              <h3 className="section-title">Lịch sử hoàn tiền</h3>
              <div className="refunds-list">
                {payment.refunds.map((refund) => (
                  <div key={refund.refund_id} className="refund-item">
                    <div className="refund-item-header">
                      <div>
                        <span className="refund-id">Mã: {refund.vnp_request_id}</span>
                        <span className={`refund-status ${getRefundStatusClass(refund.status)}`}>
                          {getRefundStatusLabel(refund.status)}
                        </span>
                      </div>
                      <div className="refund-amount">{formatCurrency(refund.amount)}</div>
                    </div>
                    <div className="refund-item-body">
                      <div className="info-row">
                        <span className="info-label">Lý do:</span>
                        <span className="info-value">{refund.reason}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Người yêu cầu:</span>
                        <span className="info-value">{refund.creator.full_name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Ngày tạo:</span>
                        <span className="info-value">{formatDate(refund.created_at)}</span>
                      </div>
                      {refund.approver && (
                        <div className="info-row">
                          <span className="info-label">Người duyệt:</span>
                          <span className="info-value">{refund.approver.full_name}</span>
                        </div>
                      )}
                      {refund.approved_at && (
                        <div className="info-row">
                          <span className="info-label">Ngày duyệt:</span>
                          <span className="info-value">{formatDate(refund.approved_at)}</span>
                        </div>
                      )}
                      {refund.reject_reason && (
                        <div className="info-row reject-reason">
                          <span className="info-label">Lý do từ chối:</span>
                          <span className="info-value">{refund.reject_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="invoice-footer">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          <p className="footer-note">Hóa đơn này được tạo tự động và có giá trị pháp lý.</p>
        </div>
      </div>
    </div>
  );
}
