import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentService } from "@/services/Payment/paymentService";
import { courseService } from "@/services/Course/courseService";
import type { PaymentInvoice } from "@/types/Payment/payment.type";
import RefundModal from "@/components/RefundModal/RefundModal";
import { useToast } from "@/components/Notification/common/ToastProvider";
import "./PaymentInvoice.css";

const PaymentInvoicePage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!paymentId) return;

      try {
        setLoading(true);
        const data = await paymentService.getPaymentInvoice(paymentId);
        setInvoice(data);
      } catch (err) {
        setError("Không thể tải thông tin hóa đơn");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [paymentId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      SUCCESS: "Thành công",
      PENDING: "Đang xử lý",
      FAILED: "Thất bại",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getRefundStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PEND: "Đang chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Từ chối",
      COMPLETED: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  const handleRefundRequest = async (reason: string) => {
    if (!invoice) return;

    try {
      setIsRefunding(true);
      const response = await courseService.createRefund(
        parseInt(invoice.course.course_id),
        reason
      );

      if (response.status === 201 && response.data.success) {
        showToast(response.data.message, "success");
        setShowRefundModal(false);
        navigate("/payments");
      } else {
        showToast("Có lỗi xảy ra khi gửi yêu cầu hoàn tiền", "error");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Không thể gửi yêu cầu hoàn tiền";
      showToast(errorMessage, "error");
    } finally {
      setIsRefunding(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="invoice-container">
        <div className="invoice-loading">Đang tải hóa đơn...</div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="invoice-container">
        <div className="invoice-error">{error || "Không tìm thấy hóa đơn"}</div>
        <button className="back-btn" onClick={() => navigate("/payments")}>
          Quay lại
        </button>
      </div>
    );
  }

  const hasRefunds = invoice.refunds && invoice.refunds.length > 0;

  return (
    <div className="invoice-container">
      <div className="invoice-actions no-print">
        <button className="back-btn" onClick={() => navigate("/payments")}>
          ← Quay lại
        </button>
        <button className="print-btn" onClick={handlePrint}>
          In hóa đơn
        </button>
      </div>

      <div className="invoice-paper">
        <div className="invoice-header">
          <div className="company-info">
            <h1>EDTECH</h1>
            <p>Nền tảng học trực tuyến</p>
            <p>Email: support@edtech.com</p>
            <p>Hotline: 1900-xxxx</p>
          </div>
          <div className="invoice-title">
            <h2>HÓA ĐƠN THANH TOÁN</h2>
            <p className="invoice-number">Số: #{invoice.payment_id}</p>
            <p className="invoice-date">
              Ngày: {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Thông tin khách hàng</h3>
          <div className="info-row">
            <span className="info-label">Họ và tên:</span>
            <span className="info-value">{invoice.buyer.full_name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{invoice.buyer.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Số điện thoại:</span>
            <span className="info-value">{invoice.buyer.phone}</span>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Chi tiết khóa học</h3>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Tên khóa học</th>
                <th>Giảng viên</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{invoice.course.title}</td>
                <td>{invoice.course.teacher}</td>
                <td className="text-right">{formatCurrency(invoice.course.price)}</td>
                <td className="text-center">1</td>
                <td className="text-right">{formatCurrency(invoice.amount)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-right">
                  <strong>Tổng cộng:</strong>
                </td>
                <td className="text-right">
                  <strong>{formatCurrency(invoice.amount)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="invoice-section">
          <h3>Thông tin thanh toán</h3>
          <div className="info-row">
            <span className="info-label">Mã giao dịch:</span>
            <span className="info-value">{invoice.txn_ref}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Số giao dịch:</span>
            <span className="info-value">{invoice.transaction_no}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phương thức:</span>
            <span className="info-value">{invoice.payment_method}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Ngân hàng:</span>
            <span className="info-value">{invoice.bank_code}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Trạng thái:</span>
            <span className={`status-badge ${invoice.status.toLowerCase()}`}>
              {getStatusText(invoice.status)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Thời gian thanh toán:</span>
            <span className="info-value">{formatDate(invoice.paid_at)}</span>
          </div>
        </div>

        {hasRefunds && (
          <div className="invoice-section refund-section">
            <h3>Thông tin hoàn tiền</h3>
            {invoice.refunds.map((refund) => (
              <div key={refund.refund_id} className="refund-item">
                <div className="info-row">
                  <span className="info-label">Mã yêu cầu:</span>
                  <span className="info-value">#{refund.refund_id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số tiền:</span>
                  <span className="info-value">{formatCurrency(refund.amount)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lý do:</span>
                  <span className="info-value">{refund.reason}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Trạng thái:</span>
                  <span className={`refund-status ${refund.status.toLowerCase()}`}>
                    {getRefundStatusText(refund.status)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày yêu cầu:</span>
                  <span className="info-value">{formatDate(refund.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="invoice-footer">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của EdTech!</p>
          <p className="note">
            Hóa đơn này được tạo tự động bởi hệ thống. Vui lòng kiểm tra thông tin.
          </p>
        </div>
      </div>

      {!hasRefunds && invoice.status === "SUCCESS" && (
        <div className="refund-action-section no-print">
          <button
            className="refund-request-btn"
            onClick={() => setShowRefundModal(true)}
            disabled={isRefunding}
          >
            Yêu cầu hoàn tiền
          </button>
        </div>
      )}

      <RefundModal
        open={showRefundModal}
        daysLeft={7}
        onConfirm={handleRefundRequest}
        onCancel={() => setShowRefundModal(false)}
      />
    </div>
  );
};

export default PaymentInvoicePage;
