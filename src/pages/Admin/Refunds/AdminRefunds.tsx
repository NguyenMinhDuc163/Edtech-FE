import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react";
import "./AdminRefunds.css";
import { refundService } from "@/services/Refund/refundService";
import type { Refund } from "@/types/Refund/refund.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import RejectModal from "./components/RejectModal";

const ITEMS_PER_PAGE = 10;

export default function AdminRefunds() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRefundIds, setSelectedRefundIds] = useState<Set<string>>(new Set());
  const [approveConfirm, setApproveConfirm] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const data = await refundService.getAllRefunds();
      const pendingRefunds = data.filter((r) => r.status === "PEND");
      setRefunds(pendingRefunds);
      setSelectedRefundIds(new Set());
    } catch (err: any) {
      console.error("Load refunds error:", err);
      showToast(err.response?.data?.message || "Tải danh sách hoàn tiền thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const totalPages = Math.ceil(refunds.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRefunds = refunds.slice(startIndex, endIndex);
  const pendingRefundsOnPage = currentRefunds.filter((r) => r.status === "PEND");
  const allPendingSelected =
    pendingRefundsOnPage.length > 0 &&
    pendingRefundsOnPage.every((r) => selectedRefundIds.has(r.vnp_request_id));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefundClick = (vnpRequestId: string) => {
    navigate(`/admin/refunds/${vnpRequestId}`);
  };

  const handleToggleSelectAll = () => {
    const newSelected = new Set(selectedRefundIds);
    if (allPendingSelected) {
      pendingRefundsOnPage.forEach((r) => newSelected.delete(r.vnp_request_id));
    } else {
      pendingRefundsOnPage.forEach((r) => newSelected.add(r.vnp_request_id));
    }
    setSelectedRefundIds(newSelected);
  };

  const handleToggleSelect = (vnpRequestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRefundIds);
    if (newSelected.has(vnpRequestId)) {
      newSelected.delete(vnpRequestId);
    } else {
      newSelected.add(vnpRequestId);
    }
    setSelectedRefundIds(newSelected);
  };

  const handleApproveClick = () => {
    if (selectedRefundIds.size === 0) return;
    setApproveConfirm(true);
  };

  const handleRejectClick = () => {
    if (selectedRefundIds.size === 0) return;
    setRejectModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    try {
      setLoading(true);
      const vnpRequestIds = Array.from(selectedRefundIds);
      const result = await refundService.approveRefunds(vnpRequestIds);
      showToast(result.message, "success");
      setApproveConfirm(false);
      setSelectedRefundIds(new Set());
      await fetchRefunds();
    } catch (err: any) {
      console.error("Approve refunds error:", err);
      showToast(err.response?.data?.message || "Phê duyệt hoàn tiền thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      setLoading(true);
      const vnpRequestIds = Array.from(selectedRefundIds);
      const result = await refundService.rejectRefunds(vnpRequestIds, reason);
      showToast(result.message, "success");
      setRejectModalOpen(false);
      setSelectedRefundIds(new Set());
      await fetchRefunds();
    } catch (err: any) {
      console.error("Reject refunds error:", err);
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
      default:
        return status;
    }
  };

  return (
    <div className="admin-refunds-page">
      <div className="admin-refunds-container">
        <header className="admin-refunds-header">
          <h2 className="admin-refunds-title">Danh sách yêu cầu hoàn tiền</h2>
          <div className="admin-refunds-actions">
            <button className="admin-btn" onClick={fetchRefunds}>
              Làm mới
            </button>
          </div>
        </header>

        <section className="admin-refunds-list-section">
          {currentRefunds.length === 0 ? (
            <div className="admin-refunds-empty">Không có yêu cầu hoàn tiền nào.</div>
          ) : (
            <>
              {pendingRefundsOnPage.length > 0 && (
                <div className="admin-refunds-select-all">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={allPendingSelected}
                      onChange={handleToggleSelectAll}
                    />
                    <span>Chọn tất cả ({pendingRefundsOnPage.length} yêu cầu chờ duyệt)</span>
                  </label>
                </div>
              )}

              <div className="admin-refunds-list">
                {currentRefunds.map((refund) => (
                  <div
                    key={refund.refund_id}
                    className={`admin-refund-item ${
                      selectedRefundIds.has(refund.vnp_request_id) ? "selected" : ""
                    }`}
                    onClick={() => handleRefundClick(refund.vnp_request_id)}
                  >
                    {refund.status === "PEND" && (
                      <div className="admin-refund-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedRefundIds.has(refund.vnp_request_id)}
                          onChange={(e) => handleToggleSelect(refund.vnp_request_id, e as any)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}

                    <div className="admin-refund-avatar">
                      {refund.creator.avatar_url ? (
                        <img
                          src={refund.creator.avatar_url}
                          alt={refund.creator.full_name || refund.creator.username}
                        />
                      ) : (
                        <div className="admin-refund-avatar-placeholder">
                          <UserIcon size={40} />
                        </div>
                      )}
                    </div>

                    <div className="admin-refund-info">
                      <div className="admin-refund-header-row">
                        <h3>{refund.creator.full_name || refund.creator.username}</h3>
                        <span className={`admin-refund-status status-${refund.status.toLowerCase()}`}>
                          {getStatusLabel(refund.status)}
                        </span>
                      </div>

                      <div className="admin-refund-meta">
                        <p>
                          <strong>Số tiền:</strong> {formatCurrency(refund.amount)}
                        </p>
                        <p>
                          <strong>Mã giao dịch:</strong> {refund.vnp_txn_ref}
                        </p>
                        <p>
                          <strong>Email:</strong> {refund.creator.email}
                        </p>
                        <p>
                          <strong>Ngày tạo:</strong> {formatDate(refund.created_at)}
                        </p>
                      </div>

                      <div className="admin-refund-reason">
                        <strong>Lý do:</strong> {refund.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {totalPages > 1 && (
          <div className="admin-refunds-pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="pagination-info">
              Trang {currentPage} / {totalPages}
            </div>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {selectedRefundIds.size > 0 && (
          <div className="admin-refunds-action-bar">
            <div className="action-bar-info">
              Đã chọn <strong>{selectedRefundIds.size}</strong> yêu cầu
            </div>
            <div className="action-bar-buttons">
              <button className="action-bar-btn action-bar-btn-reject" onClick={handleRejectClick}>
                Từ chối
              </button>
              <button className="action-bar-btn action-bar-btn-approve" onClick={handleApproveClick}>
                Phê duyệt
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={approveConfirm}
        title="Xác nhận phê duyệt"
        message={`Bạn có chắc chắn muốn phê duyệt ${selectedRefundIds.size} yêu cầu hoàn tiền? Hành động này sẽ tiến hành hoàn tiền cho các yêu cầu đã chọn.`}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveConfirm(false)}
      />

      <RejectModal
        isOpen={rejectModalOpen}
        count={selectedRefundIds.size}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalOpen(false)}
      />
    </div>
  );
}
