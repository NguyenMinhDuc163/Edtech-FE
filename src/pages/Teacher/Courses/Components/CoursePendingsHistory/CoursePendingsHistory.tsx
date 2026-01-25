import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  getCoursePendingHistory,
  resubmitRejectedChange,
  submitPendingChangeForReview,
  deletePendingChange
} from "@/services/Course/TeacherPendingChangesService";
import Pagination from "@/components/Pagination/Pagination";
import "./CoursePendingsHistory.css";
import type { PaginationData, PendingChange } from "@/types/Course/PendingHistoryParams";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useLoadingStore } from "@/store/loadingStore";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

type StatusType = "all" | "draft" | "pending" | "approved" | "rejected";
const LIMIT_OPTIONS = [10, 20, 50] as const;
type LimitOption = typeof LIMIT_OPTIONS[number];

const STATUS_LABELS: Record<StatusType, string> = {
  all: "Tất cả",
  draft: "Đang soạn",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Bị từ chối",
};

const CoursePendingsHistory = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { showToast } = useToast();
  const [history, setHistory] = useState<PendingChange[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 20, total: 0 });
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusType>("all");
  const [limit, setLimit] = useState<LimitOption>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectErrors, setRejectErrors] = useState<Record<string, string[]>>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      const res = await getCoursePendingHistory({
        courseId,
        page: currentPage,
        limit,
        includeDraft: true,
      });

      let filteredData = res.data;

      if (statusFilter !== "all") {
        filteredData = res.data.filter((item: PendingChange) => item.status === statusFilter);
      }

      setHistory(filteredData);
      setPagination({
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
      });
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
      showToast('Không thể tải lịch sử thay đổi!', "error");
      setHistory([]);
      setPagination({ page: 1, limit: 20, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [courseId, currentPage, limit, statusFilter]);

  // Hàm gửi duyệt
  const handleSubmitForReview = async (pendingChangeId: string) => {
    setSubmittingId(pendingChangeId);
    try {
      const response = await submitPendingChangeForReview(pendingChangeId);

      if (response?.status >= 400) {
        const error = new Error(response.message || "Gửi duyệt thất bại");
        (error as any).response = { data: response };
        throw error;
      }

      showToast('Đã gửi yêu cầu duyệt thành công!', "success");
      // Xóa lỗi cũ nếu thành công
      setRejectErrors(prev => ({ ...prev, [pendingChangeId]: [] }));
      await fetchHistory();
    } catch (error: any) {
      const res = error.response?.data || {};

      const rawErrors =
        Array.isArray(res.data) ? res.data :
          res.data?.reasons ||
          res.data?.errors ||
          res.reasons || [];

      // LOẠI BỎ LỖI TRÙNG – CHỈ GIỮ LẦN ĐẦU
      const uniqueErrors = Array.from(new Set(
        rawErrors.map((e: any) => typeof e === 'string' ? e : e.message || String(e))
      ));

      showToast('Gửi duyệt thất bại!', "error");

      // LƯU LỖI VÀO STATE ĐỂ HIỆN DƯỚI DRAFT
      setRejectErrors(prev => ({ ...prev, [pendingChangeId]: uniqueErrors as string[] }));

      await fetchHistory();
    } finally {
      setSubmittingId(null);
    }
  };

  const handleResubmit = async (pendingChangeId: string) => {
    if (!confirm("Bạn có muốn mở lại bản nháp này để chỉnh sửa không?")) return;

    try {
      await resubmitRejectedChange(pendingChangeId);
      showToast('Đã mở lại bản nháp để chỉnh sửa!', "success");
      await fetchHistory();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Không thể mở lại bản nháp", "error");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);   
    setConfirmDialogOpen(true); 
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const res = await deletePendingChange(deleteTargetId);
      showToast(res.message || "Xóa thành công!", "success");
      await fetchHistory();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Xóa thất bại", "error");
    } finally {
      setConfirmDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setDeleteTargetId(null);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      draft: "badge-draft",
      pending: "badge-pending",
      approved: "badge-approved",
      rejected: "badge-rejected",
    };
    const className = map[status] || "badge-default";
    return <span className={`badge ${className}`}>{STATUS_LABELS[status as StatusType] || status}</span>;
  };

  const renderChangeData = (changeData: any) => {
    if (!changeData?.sections || changeData.sections.length === 0) {
      return <em style={{ color: "#888", fontStyle: "italic" }}>Không có thay đổi chi tiết</em>;
    }

    return (
      <div className="nested-change-data">
        {changeData.sections.map((section: any, secIdx: number) => {
          const isNewSection = section.type === "add";

          return (
            <div key={secIdx} className="section-block">
              {/* Header chương */}
              <div className="section-header">
                <span className={`section-badge ${isNewSection ? "section-new" : "section-update"}`}>
                  {isNewSection ? "CHƯƠNG MỚI" : "SỬA CHƯƠNG"}
                </span>
                <h4 className="section-title">
                  {section.title || "(Chưa có tiêu đề chương)"}
                </h4>
                {section.section_id && (
                  <span className="section-id">ID: {section.section_id}</span>
                )}
              </div>

              {section.description && (
                <p className="section-desc">"{section.description}"</p>
              )}

              {/* Danh sách bài học */}
              {section.contents && section.contents.length > 0 ? (
                <div className="lessons-list">
                  {section.contents.map((content: any, contIdx: number) => {
                    const isNewContent = content.type === "add";

                    return (
                      <div key={contIdx} className="lesson-item">
                        <div className="lesson-header">
                          <span className={`lesson-badge ${isNewContent ? "lesson-new" : "lesson-update"}`}>
                            {isNewContent ? "BÀI MỚI" : "SỬA BÀI"}
                          </span>
                          <strong className="lesson-title">
                            {content.title || "(Chưa có tiêu đề bài học)"}
                          </strong>
                        </div>

                        {content.description && (
                          <p className="lesson-desc">{content.description}</p>
                        )}

                        {/* Hiển thị file */}
                        {content.files && content.files.length > 0 && (
                          <div className="lesson-files">
                            {content.files.map((file: any, fIdx: number) => (
                              <span key={fIdx} className="file-tag">
                                {file.file_type === "document" && "PDF"}
                                {file.file_type === "video" && "Video"}
                                {file.file_type === "image" && "Ảnh"}
                                {["pdf", "doc", "docx", "ppt", "pptx"].some(ext => file.filename?.endsWith(ext)) && "Tài liệu"}
                                {!["document", "video", "image"].includes(file.file_type) && "File"}
                                {" "}{file.filename || file.title || "Tệp đính kèm"}
                                {file.is_preview === "Y" && (
                                  <span className="preview-label">Preview</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Xem trước miễn phí */}
                        {content.is_preview && (
                          <div className="preview-toggle">
                            <span className={`preview-status ${content.is_preview === "Y" ? "preview-yes" : "preview-no"}`}>
                              {content.is_preview === "Y" ? "Xem trước miễn phí" : "Chỉ xem khi mua"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-lessons">Chưa có bài học nào trong chương này</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const totalPages = Math.ceil(pagination.total / limit);
  const filteredCount = history.length;
  const showNoData = filteredCount === 0;

  return (
    <div className="course-pending-history">
      <div className="page-header">
        <h2>Lịch sử thay đổi khóa học</h2>
        <div className="filters">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusType)}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showNoData ? (
        <p className="no-data">Không có thay đổi nào phù hợp với bộ lọc.</p>
      ) : (
        <>
          <div className="history-list">
            {history.map((item) => {
              const errors = rejectErrors[item.id] || [];

              return (
                <div key={item.id} className="history-card">
                  <div className="history-header">
                    <div className="header-left">
                      <strong>#{item.id}</strong> • bởi <strong>{item.submittedBy.username}</strong>
                    </div>
                    <div className="header-right">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  <div className="history-meta">
                    <small>
                      Tạo: {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                      {item.updatedAt !== item.createdAt && (
                        <> • Cập nhật: {format(new Date(item.updatedAt), "dd/MM/yyyy HH:mm")}</>
                      )}
                    </small>
                  </div>

                  {/* HIỆN LỖI TỰ ĐỘNG SAU KHI GỬI THẤT BẠI */}
                  {errors.length > 0 && (
                    <div style={{
                      margin: "16px 0",
                      padding: "16px",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      color: "#991b1b"
                    }}>
                      <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>
                        Không thể gửi duyệt ({errors.length} lỗi)
                      </p>
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {errors.map((err, idx) => (
                          <li key={idx} style={{ marginBottom: "4px", fontSize: "14px" }}>
                            {err}
                          </li>
                        ))}
                      </ul>
                      <div style={{ marginTop: "12px" }}>
                        <Link to={`/teacher/courses/${courseId}/draft-edit/${item.id}`}>
                          <button style={{
                            padding: "8px 16px",
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}>
                            Sửa ngay
                          </button>
                        </Link>
                        
                      </div>
                    </div>
                  )}

                  <div className="change-data">
                    <strong>Chi tiết thay đổi:</strong>
                    {renderChangeData(item.changeData)}
                  </div>

                  {/* NÚT GỬI DUYỆT */}
                  {item.status === "draft" && (
                    <div style={{
                      marginTop: "20px",
                      display: "flex",
                      gap: "12px",
                      justifyContent: "flex-end",
                      flexWrap: "wrap"
                    }}>
                      {/* NÚT CHỈNH SỬA */}
                      <Link to={`/teacher/courses/${courseId}/draft-edit/${item.id}`} style={{ textDecoration: "none" }}>
                        <button
                          style={{
                            padding: "10px 20px",
                            background: "#10B981",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "15px",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            minWidth: "120px"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
                          onMouseOut={(e) => e.currentTarget.style.background = "#10B981"}
                        >
                          Chỉnh sửa
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "10px 20px",
                          background: "#EF4444",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "15px",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          minWidth: "120px"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#DC2626"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#EF4444"}
                      >
                        Xóa
                      </button>

                      {/* NÚT GỬI DUYỆT */}
                      <button
                        onClick={() => handleSubmitForReview(item.id)}
                        disabled={submittingId === item.id}
                        style={{
                          padding: "10px 20px",
                          background: submittingId === item.id ? "#93c5fd" : "#3D5CFF", // xanh dương
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "15px",
                          cursor: submittingId === item.id ? "not-allowed" : "pointer",
                          opacity: submittingId === item.id ? 0.7 : 1,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          minWidth: "120px"
                        }}
                      >
                        {submittingId === item.id ? "Đang gửi..." : "Gửi duyệt"}
                      </button>
                    </div>
                  )}

                  {/* NÚT CHỈNH SỬA KHI BỊ REJECT */}
                  {item.status === "rejected" && (
                    <button
                      onClick={() => handleResubmit(item.id)}
                      style={{
                        padding: "10px 20px",
                        background: "#FF6B35",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "15px"
                      }}
                    >
                      Chỉnh sửa lại
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={pagination.total}
            itemsPerPage={limit}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onItemsPerPageChange={(newLimit) => {
              setLimit(newLimit as LimitOption);
              setCurrentPage(1);
            }}
            showTotal={true}
            showItemsPerPage={true}
            itemsPerPageOptions={[...LIMIT_OPTIONS]}
          />
        </>
      )}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa thay đổi này?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <FloatingBackButton/>
    </div>
  );
};

export default CoursePendingsHistory;