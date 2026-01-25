import { useEffect, useState } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiFilter,
  FiAlertCircle,
} from "react-icons/fi";
import { adminPendingChangeService } from "@/services/Course/adminPendingChangeService";
import type { PendingChange } from "@/services/Course/adminPendingChangeService";

import "./Pendingchange.css";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { COURSE_STATUS_LABEL } from "@/utils/ui/constants";

const ITEMS_PER_PAGE = 10;

export default function PendingChange() {
  const { showToast } = useToast();
  const [changes, setChanges] = useState<PendingChange[]>([]);
  const [allChanges, setAllChanges] = useState<PendingChange[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedChange, setSelectedChange] = useState<PendingChange | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Trạng thái xử lý để chống double click
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBatchApproveModal, setShowBatchApproveModal] = useState(false);
  const [showBatchRejectModal, setShowBatchRejectModal] = useState(false);
  const [batchRejectReason, setBatchRejectReason] = useState("");
  const [batchProcessing, setBatchProcessing] = useState(false);

  // === HELPER ===
  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;
  const selectedPendingChanges = changes.filter(c => selectedIds.has(c.id) && c.status === "pending");
  const canBatchAction = selectedPendingChanges.length > 0;

  // Toggle chọn 1 item
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Chọn tất cả trên trang hiện tại
  const selectAllOnPage = () => {
    const pageIds = changes.filter(c => c.status === "pending").map(c => c.id);
    setSelectedIds(prev => {
      const next = new Set(prev);
      pageIds.forEach(id => next.add(id));
      return next;
    });
  };

  // Bỏ chọn tất cả
  const clearSelection = () => setSelectedIds(new Set());

  const confirmBatchApprove = async () => {
    if (!canBatchAction || batchProcessing) return;

    setBatchProcessing(true);
    try {
      const ids = Array.from(selectedIds);
      const response = await adminPendingChangeService.batchApprove(ids);

      // ĐỌC ĐÚNG CẤU TRÚC RESPONSE THỰC TẾ
      const successIds = response.data?.details?.success || [];
      const failedIds = response.data?.details?.failed || [];

      // CẬP NHẬT TRẠNG THÁI NGAY LẬP TỨC
      setAllChanges(prev => prev.map(item =>
        successIds.includes(item.id)
          ? { ...item, status: "approved" as const }
          : item
      ));

      showToast('Duyệt khóa học thành công!', "success");
      if (failedIds.length > 0) {
        showToast(`Có ${failedIds.length} thay đổi thất bại`, "warning");
      }

      clearSelection();
    } catch (err: any) {
      showToast('Duyệt khóa học thành công!', "error");
    } finally {
      setBatchProcessing(false);
      setShowBatchApproveModal(false);
    }
  };

  const confirmBatchReject = async () => {
    if (!canBatchAction || batchProcessing || !batchRejectReason.trim()) return;

    setBatchProcessing(true);
    try {
      const ids = Array.from(selectedIds);
      const response = await adminPendingChangeService.batchReject(ids, batchRejectReason.trim());

      // ĐỌC ĐÚNG: response.data.details.success
      const successIds = response.data?.details?.success || [];
      const failedIds = response.data?.details?.failed || [];

      // CẬP NHẬT TRẠNG THÁI NGAY LẬP TỨC
      setAllChanges(prev => prev.map(item =>
        successIds.includes(item.id)
          ? { ...item, status: "rejected" as const }
          : item
      ));

      showToast('Đã từ chối thành công!', "success");
      if (failedIds.length > 0) {
        showToast(`Có ${failedIds.length} thay đổi thất bại`, "warning");
      }

      clearSelection();
      setBatchRejectReason("");
    } catch (err: any) {
      console.error("Batch reject error:", err.response?.data);
      showToast(err.response?.data?.message || "Batch từ chối thất bại", "error");
    } finally {
      setBatchProcessing(false);
      setShowBatchRejectModal(false);
    }
  };

  // Tải toàn bộ dữ liệu 1 lần duy nhất khi cần
  const fetchAllChanges = async () => {
    try {
      const data = await adminPendingChangeService.getAllPending();
      setAllChanges(data);
    } catch (err) {
      console.error("Lỗi load pending changes:", err);
      showToast('Không tải được danh sách thay đổi', "error");
      setAllChanges([]);
    }
  };

  useEffect(() => {
    let filtered = [...allChanges];

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Tìm kiếm
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.course.title.toLowerCase().includes(lowerSearch) ||
          c.submittedBy.email.toLowerCase().includes(lowerSearch)
      );
    }

    // Phân trang
    const total = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setTotalPages(total);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, end);

    setChanges(paginated);

    // Tự động về trang 1 nếu trang hiện tại vượt quá tổng trang
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  }, [allChanges, searchTerm, statusFilter, currentPage]);

  // Load lần đầu
  useEffect(() => {
    fetchAllChanges();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "#f59e0b",
      approved: "#10b981",
      rejected: "#ef4444",
    };
    return map[status] || "#94a3b8";
  };

  // === XỬ LÝ DUYỆT ===
  const handleApprove = (change: PendingChange) => {
    setSelectedChange(change);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedChange || processingId) return;

    setProcessingId(selectedChange.id);
    try {
      await adminPendingChangeService.approve(selectedChange.id);
      showToast('Duyệt khóa học thành công!', "success");
      await fetchAllChanges(); // Tải lại dữ liệu mới nhất
    } catch (err) {
      showToast('Duyệt khóa học thất bại!', "error");
    } finally {
      setProcessingId(null);
      setShowApproveModal(false);
      setSelectedChange(null);
    }
  };

  // === XỬ LÝ TỪ CHỐI ===
  const handleReject = (change: PendingChange) => {
    setSelectedChange(change);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedChange || !rejectReason.trim() || processingId) {
      if (!rejectReason.trim()) {
        showToast('Vui lòng nhập lý do từ chối!', "warning");
      };
      return;
    }

    setProcessingId(selectedChange.id);
    try {
      await adminPendingChangeService.reject(selectedChange.id, rejectReason.trim());
      showToast('Đã từ chối!', "success");
      await fetchAllChanges();
    } catch (err) {
      showToast('Từ chối thất bại!', "error");
    } finally {
      setProcessingId(null);
      setShowRejectModal(false);
      setSelectedChange(null);
      setRejectReason("");
    }
  };

  const isProcessing = processingId === selectedChange?.id;

  return (
    <div className="pending-change-container">
      <div className="pending-change-header">
        <h2 className="pending-change-title">
          Thay đổi chờ duyệt
          {hasSelection && (
            <span style={{ marginLeft: 12, fontSize: "1.1rem", color: "#3b82f6" }}>
              Đã chọn: <strong>{selectedCount}</strong>
            </span>
          )}
        </h2>

        <div className="header-controls">
          {/* NÚT BATCH ACTION – CHỈ HIỆN KHI CÓ CHỌN */}
          {hasSelection && (
            <div style={{ display: "flex", gap: 10, marginRight: 16 }}>
              <button
                onClick={() => setShowBatchApproveModal(true)}
                disabled={!canBatchAction || batchProcessing}
                style={{
                  padding: "8px 16px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: canBatchAction ? "pointer" : "not-allowed",
                  opacity: canBatchAction ? 1 : 0.6,
                }}
              >
                Duyệt ({selectedPendingChanges.length})
              </button>

              <button
                onClick={() => setShowBatchRejectModal(true)}
                disabled={!canBatchAction || batchProcessing}
                style={{
                  padding: "8px 16px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: canBatchAction ? "pointer" : "not-allowed",
                  opacity: canBatchAction ? 1 : 0.6,
                }}
              >
                Từ chối ({selectedPendingChanges.length})
              </button>

              <button
                onClick={clearSelection}
                style={{ padding: "8px 12px", background: "#64748b", color: "white", border: "none", borderRadius: 8 }}
              >
                Bỏ chọn
              </button>
            </div>
          )}

          {/* Filter & Search giữ nguyên */}
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); clearSelection(); }} className="status-filter">
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="all">Tất cả</option>
            </select>
          </div>

          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Tìm theo tên khóa học hoặc email..." value={searchTerm} onChange={handleSearchChange} className="search-input1" />
            {searchTerm && <button className="search-clear-btn" onClick={() => { setSearchTerm(""); setCurrentPage(1); }}><FiX /></button>}
          </div>
        </div>
      </div>

      {changes.length === 0 ? (
        <div className="empty-state">
          <p>Không có thay đổi nào</p>
          {searchTerm && <small>Kết quả tìm kiếm: 0</small>}
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="pending-change-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={changes.length > 0 && changes.filter(c => c.status === "pending").every(c => selectedIds.has(c.id))}
                      onChange={selectAllOnPage}
                      title="Chọn tất cả trên trang"
                    />
                  </th>
                  <th>Khóa học</th>
                  <th>Giảng viên</th>
                  <th>Thay đổi</th>
                  <th>Trạng thái</th>
                  <th>Tạo lúc</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((pc) => (
                  <tr key={pc.id} className="change-row">
                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
                      {pc.status === "pending" ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(pc.id)}
                          onChange={() => toggleSelect(pc.id)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <span style={{ color: "#94a3b8" }}>-</span>
                      )}
                    </td>
                    <td data-label="Khóa học">
                      <div>
                        <strong>{pc.course.title}</strong>
                        <small className="course-id">ID: {pc.course.course_id}</small>
                      </div>
                    </td>
                    <td data-label="Giảng viên">
                      <div>
                        <div>{pc.submittedBy.username}</div>
                        <small>{pc.submittedBy.email}</small>
                      </div>
                    </td>
                    <td data-label="Thay đổi" className="change-data">
                      {pc.changeData.addSections?.length > 0 && (
                        <div className="change-item">
                          <FiCheck /> Thêm {pc.changeData.addSections.length} section
                        </div>
                      )}
                      {pc.changeData.addContents?.length > 0 && (
                        <div className="change-item">
                          <FiCheck /> Thêm {pc.changeData.addContents.length} bài học
                        </div>
                      )}
                    </td>
                    <td data-label="Trạng thái">
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(pc.status) }}
                      >
                        {COURSE_STATUS_LABEL[pc.status.trim().toUpperCase()] || pc.status}
                      </span>
                    </td>
                    <td data-label="Tạo lúc">{formatDate(pc.createdAt)}</td>
                    <td data-label="Hành động" onClick={(e) => e.stopPropagation()}>
                      {pc.status === "pending" && (
                        <div className="action-buttons">
                          <button
                            className="btn-approve-sm"
                            onClick={() => handleApprove(pc)}
                            title="Duyệt"
                            disabled={processingId === pc.id}
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="btn-reject-sm"
                            onClick={() => handleReject(pc)}
                            title="Từ chối"
                            disabled={processingId === pc.id}
                          >
                            <FiX />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <FiChevronLeft />
              </button>
              <span>
                Trang <strong>{currentPage}</strong> / {totalPages}
              </span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* === MODAL DUYỆT === */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FiAlertCircle className="modal-icon warning" />
              <h3>Xác nhận duyệt</h3>
            </div>
            <p>
              Bạn có chắc chắn muốn <strong>duyệt</strong> thay đổi này?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowApproveModal(false)}>
                Hủy
              </button>
              <button
                className="btn-confirm approve"
                onClick={confirmApprove}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : <>Duyệt</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL TỪ CHỐI === */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FiAlertCircle className="modal-icon danger" />
              <h3>Lý do từ chối</h3>
            </div>
            <textarea
              placeholder="Nhập lý do từ chối (bắt buộc)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="reject-reason-input"
              rows={4}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowRejectModal(false)}>
                Hủy
              </button>
              <button
                className="btn-confirm reject"
                onClick={confirmReject}
                disabled={!rejectReason.trim() || isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : <>Từ chối</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BATCH APPROVE */}
      {showBatchApproveModal && (
        <div className="modal-overlay" onClick={() => !batchProcessing && setShowBatchApproveModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ color: "#10b981" }}>
              <FiCheck size={32} />
              <h3>Duyệt hàng loạt</h3>
            </div>
            <p>
              Bạn có chắc chắn muốn <strong>duyệt {selectedPendingChanges.length}</strong> thay đổi này?
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowBatchApproveModal(false)}
                disabled={batchProcessing}
              >
                Hủy
              </button>
              <button
                className="btn-confirm approve"
                onClick={confirmBatchApprove}
                disabled={batchProcessing}
              >
                {batchProcessing ? "Đang xử lý..." : "Duyệt tất cả"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BATCH REJECT */}
      {showBatchRejectModal && (
        <div className="modal-overlay" onClick={() => !batchProcessing && setShowBatchRejectModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ color: "#ef4444" }}>
              <FiX size={32} />
              <h3>Từ chối hàng loạt</h3>
            </div>
            <p>
              Nhập lý do từ chối cho <strong>{selectedPendingChanges.length}</strong> thay đổi:
            </p>
            <textarea
              placeholder="Ví dụ: Tiêu đề chương quá ngắn, có từ cấm, mô tả chưa đủ chi tiết..."
              value={batchRejectReason}
              onChange={e => setBatchRejectReason(e.target.value)}
              rows={5}
              className="reject-reason-input"
              style={{ width: "100%", marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => { setShowBatchRejectModal(false); setBatchRejectReason(""); }}
                disabled={batchProcessing}
              >
                Hủy
              </button>
              <button
                className="btn-confirm reject"
                onClick={confirmBatchReject}
                disabled={batchProcessing || !batchRejectReason.trim()}
              >
                {batchProcessing ? "Đang xử lý..." : "Từ chối tất cả"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
