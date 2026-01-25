import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import "./AdminPaymentHistory.css";
import { paymentService } from "@/services/Payment/paymentService";
import type { Payment, PaymentStatistics, PaymentFilterParams } from "@/types/Payment/payment.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";

export default function AdminPaymentHistory() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<PaymentFilterParams>({
    page: 1,
    limit: 20,
  });

  const [tempFilters, setTempFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    paymentMethod: "",
    transactionStatus: "",
    search: "",
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentHistory(filters);
      setPayments(response.data.payments);
      setStatistics(response.data.statistics);
      setTotal(response.total);
    } catch (err: any) {
      console.error("Load payment history error:", err);
      showToast(err.response?.data?.message || "Tải lịch sử thanh toán thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      dateFrom: tempFilters.dateFrom || undefined,
      dateTo: tempFilters.dateTo || undefined,
      status: tempFilters.status || undefined,
      paymentMethod: tempFilters.paymentMethod || undefined,
      transactionStatus: tempFilters.transactionStatus || undefined,
      search: tempFilters.search || undefined,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setTempFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
      paymentMethod: "",
      transactionStatus: "",
      search: "",
    });
    setFilters({ page: 1, limit: 20 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
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
    const statusMap: Record<string, string> = {
      SUCCESS: "Thành công",
      FAILED: "Thất bại",
      PENDING: "Chờ xử lý",
      CANCELLED: "Đã hủy",
      REFUNDED_FULL: "Hoàn tiền đầy đủ",
      REFUNDED_PARTIAL: "Hoàn tiền một phần",
      REFUND_PROCESSING: "Đang xử lý hoàn tiền",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "status-success";
      case "FAILED":
      case "CANCELLED":
        return "status-failed";
      case "PENDING":
        return "status-pending";
      case "REFUNDED_FULL":
      case "REFUNDED_PARTIAL":
        return "status-refunded";
      default:
        return "";
    }
  };

  const totalPages = Math.ceil(total / (filters.limit || 20));

  return (
    <div className="payment-history-page">
      <div className="payment-history-header">
        <h1 className="page-title">Lịch sử thanh toán</h1>
      </div>

      {statistics && (
        <div className="statistics-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <p className="aph__stat-label">Tổng giao dịch</p>
              <p className="aph__stat-value">{statistics.total_transactions}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <p className="aph__stat-label">Thành công</p>
              <p className="aph__stat-value aph__stat-value-green">{formatCurrency(statistics.total_amount_success.toString())}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <p className="aph__stat-label">Đã hoàn tiền</p>
              <p className="aph__stat-value aph__stat-value-red">{formatCurrency(statistics.total_amount_refunded.toString())}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-gray">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <p className="aph__stat-label">Thất bại</p>
              <p className="aph__stat-value">{formatCurrency(statistics.total_amount_failed.toString())}</p>
            </div>
          </div>
        </div>
      )}

      <div className="filter-section">
        <div className="filter-header">
          <h3>Bộ lọc</h3>
        </div>

        <div className="filter-grid">
          <div className="filter-item">
            <label>Từ ngày</label>
            <input
              type="date"
              value={tempFilters.dateFrom}
              onChange={(e) => setTempFilters({ ...tempFilters, dateFrom: e.target.value })}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <label>Đến ngày</label>
            <input
              type="date"
              value={tempFilters.dateTo}
              onChange={(e) => setTempFilters({ ...tempFilters, dateTo: e.target.value })}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <label>Trạng thái gốc</label>
            <select
              value={tempFilters.status}
              onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">Tất cả</option>
              <option value="SUCCESS">Thành công</option>
              <option value="FAILED">Thất bại</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Phương thức</label>
            <select
              value={tempFilters.paymentMethod}
              onChange={(e) => setTempFilters({ ...tempFilters, paymentMethod: e.target.value })}
              className="filter-select"
            >
              <option value="">Tất cả</option>
              <option value="VNPAY">VNPAY</option>
              <option value="MOMO">MOMO</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Trạng thái hoàn tiền</label>
            <select
              value={tempFilters.transactionStatus}
              onChange={(e) => setTempFilters({ ...tempFilters, transactionStatus: e.target.value })}
              className="filter-select"
            >
              <option value="">Tất cả</option>
              <option value="SUCCESS">Thành công</option>
              <option value="REFUNDED_FULL">Hoàn tiền đầy đủ</option>
              <option value="REFUNDED_PARTIAL">Hoàn tiền một phần</option>
              <option value="REFUND_PROCESSING">Đang xử lý hoàn tiền</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Tìm kiếm</label>
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={tempFilters.search}
                onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })}
                placeholder="Mã giao dịch, tên..."
                className="filter-input search-input"
              />
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleResetFilters} className="btn-reset">
            Đặt lại
          </button>
          <button onClick={handleApplyFilters} className="btn-apply">
            Truy vấn
          </button>
        </div>
      </div>

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Người dùng</th>
              <th>Khóa học</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Ngày thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-message">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.payment_id} onClick={() => navigate(`/admin/payments/${payment.payment_id}`)} className="clickable-row">
                  <td>
                    <div className="txn-ref">{payment.txn_ref}</div>
                    <div className="txn-no">#{payment.transaction_no}</div>
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{payment.user.full_name}</div>
                      <div className="user-email">{payment.user.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      <img src={payment.course.thumbnail_url} alt={payment.course.title} className="course-thumb" />
                      <div className="course-title">{payment.course.title}</div>
                    </div>
                  </td>
                  <td className="amount">{formatCurrency(payment.amount)}</td>
                  <td>
                    <div className="payment-method">{payment.payment_method}</div>
                    <div className="bank-code">{payment.bank_code}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.transaction_status)}`}>
                      {getStatusLabel(payment.transaction_status)}
                    </span>
                  </td>
                  <td>{formatDate(payment.paid_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(filters.page! - 1)}
            disabled={filters.page === 1}
          >
            Trước
          </button>
          <span className="pagination-info">
            Trang {filters.page} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(filters.page! + 1)}
            disabled={filters.page === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
