import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paymentService } from "@/services/Payment/paymentService";
import type { StudentPayment } from "@/types/Payment/payment.type";
import "./PaymentsPage.css";

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "refunding">("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getMyPayments();
        setPayments(data);
        setFilteredPayments(data);
      } catch (err) {
        setError("Không thể tải danh sách thanh toán");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter((payment) =>
        payment.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === "success") {
      filtered = filtered.filter((payment) => payment.refund_status === null);
    } else if (statusFilter === "refunding") {
      filtered = filtered.filter((payment) => payment.refund_status !== null);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
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

  const getRefundStatusText = (status: string | null) => {
    if (!status) return null;
    switch (status) {
      case "PEND":
        return "Đang chờ hoàn tiền";
      case "APPROVED":
        return "Đã duyệt hoàn tiền";
      case "REJECTED":
        return "Từ chối hoàn tiền";
      case "COMPLETED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading-state">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-container">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h1>Lịch sử thanh toán</h1>
        <p className="payments-subtitle">
          Quản lý tất cả các giao dịch thanh toán của bạn
        </p>
      </div>

      <div className="payments-filters">
        <div className="search-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <button
            className={statusFilter === "all" ? "active" : ""}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={statusFilter === "success" ? "active" : ""}
            onClick={() => setStatusFilter("success")}
          >
            Thành công
          </button>
          <button
            className={statusFilter === "refunding" ? "active" : ""}
            onClick={() => setStatusFilter("refunding")}
          >
            Đang hoàn tiền
          </button>
        </div>
      </div>

      <div className="payments-stats">
        <div className="stat-item">
          <span className="stat-label">Tổng giao dịch</span>
          <span className="stat-value">{filteredPayments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Tổng chi tiêu</span>
          <span className="stat-value">
            {formatCurrency(
              filteredPayments
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                .toString()
            )}
          </span>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <p>Không tìm thấy giao dịch nào</p>
        </div>
      ) : (
        <div className="payments-list">
          {filteredPayments.map((payment) => (
            <div
              key={payment.payment_id}
              className="payment-item"
              onClick={() => navigate(`/payments/${payment.payment_id}`)}
            >
              <div className="payment-thumbnail">
                <img src={payment.thumbnail_url} alt={payment.course_title} />
              </div>

              <div className="payment-info">
                <h3 className="course-title">{payment.course_title}</h3>
                <div className="payment-meta">
                  <span className="payment-date">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatDate(payment.paid_at)}
                  </span>
                  <span className="payment-id">Mã GD: #{payment.payment_id}</span>
                </div>
              </div>

              <div className="payment-price">
                <div className="price-row">
                  <span className="price-label">Giá gốc:</span>
                  <span className="original-price">
                    {formatCurrency(payment.course_price)}
                  </span>
                </div>
                <div className="price-row">
                  <span className="price-label">Đã thanh toán:</span>
                  <span className="paid-amount">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>

              <div className="payment-status">
                {payment.refund_status === null ? (
                  <span className="status-badge success">Thành công</span>
                ) : (
                  <div className="refund-info">
                    <span className="status-badge refunding">
                      {getRefundStatusText(payment.refund_status)}
                    </span>
                    {payment.vnp_request_id && (
                      <span className="refund-id">
                        Mã yêu cầu: {payment.vnp_request_id}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
