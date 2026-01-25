import { useEffect, useState } from "react";
import {
  getTeacherPendingChanges,
  submitPendingChangeForReview,
} from "@/services/Course/TeacherPendingChangesService";
import "./TeacherPendingChanges.css";
import { useToast } from "@/components/Notification/common/ToastProvider";
import type { PendingChange } from "@/types/Course/pendingchange";
import SearchPendingChange from "@/components/SearchPendingChange/SearchPendingChange";
import { useLoadingStore } from "@/store/loadingStore";
import { COURSE_STATUS_LABEL } from "@/utils/ui/constants";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

export default function TeacherPendingChanges() {
  const [allChanges, setAllChanges] = useState<PendingChange[]>([]);
  const [filteredChanges, setFilteredChanges] = useState<PendingChange[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Fetch pending changes from API
  const fetchChanges = async () => {
    setLoading(true);
    try {
      const res = await getTeacherPendingChanges();
      const rawData = res?.data;

      if (Array.isArray(rawData)) {
        const formatted: PendingChange[] = rawData.map((item: any) => ({
          pendingChangeId: item.id,
          courseId: item.course?.course_id || "unknown",
          courseTitle: item.course?.title || "Untitled Course",
          status: item.status,
          createdAt: item.createdAt,
          changeData: {
            addSections: item.changeData?.addSections || [],
            addContents: item.changeData?.addContents || [],
            updateSections: item.changeData?.updateSections || {},
            updateContents: item.changeData?.updateContents || {},
          },
        }));
        setAllChanges(formatted);
        setFilteredChanges(formatted);
      } else {
        setAllChanges([]);
        setFilteredChanges([]);
        if (res?.message) showToast(res.message, "info");
      }
    } catch (error: any) {
      console.error("Lỗi mạng:", error);
      showToast("Không tải được các thay đổi đang chờ xử lý. Vui lòng thử lại.", "error");
      setAllChanges([]);
      setFilteredChanges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChanges();
  }, []);

  // Submit pending change for review
  const handleSubmit = async (id: string) => {
    setSubmitting(id);
    try {
      const result = await submitPendingChangeForReview(id);
      if (result?.code !== 200) throw new Error(result.message || "Submit failed");
      showToast("Đã gửi để quản trị viên xem xét!", "success");
      await fetchChanges();
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const message = backendMessage || error.message || "Submit failed.";

      if (
        message.includes("already has a change awaiting review") ||
        message.includes("already has a pending change") ||
        message.includes("awaiting review")
      ) {
        showToast("Bạn đã có một lần chỉnh sửa đang chờ duyệt.", "warning");
      } else if (message.includes("No changes to submit")) {
        showToast("Không có thay đổi nào để gửi. Vui lòng thêm nội dung trước.", "info");
      } else if (message.includes("Cannot submit")) {
        showToast("Không thể gửi: Mục này chưa ở trạng thái nháp.", "error");
      } else {
        showToast(message, "error");
      }

      await fetchChanges();
    } finally {
      setSubmitting(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: "#94a3b8",
      pending: "#f59e0b",
      approved: "#10b981",
      rejected: "#ef4444",
    };
    return map[status] || "#94a3b8";
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="pending-changes-page">
      <div className="page-header">
        <h1>Danh sách thay đổi khóa học</h1>
      </div>

      {/* Search bar */}
      <SearchPendingChange changes={allChanges} onFilter={setFilteredChanges} />

      <div className="pending-changes-list">
        {filteredChanges.length === 0 ? (
          <div className="empty-state">
            <p>Không có thay đổi nào</p>
            <small>Tất cả các khóa học của bạn đều được cập nhật!</small>
          </div>
        ) : (
          filteredChanges.map((pc) => (
            <div
              key={pc.pendingChangeId}
              className="change-block"
              onClick={() => toggleExpand(pc.pendingChangeId)}
            >
              {/* Header */}
              <div className="change-header">
                <div className="change-title">
                  <h4>{pc.courseTitle}</h4>
                  <span className="course-id">ID: {pc.courseId}</span>
                </div>
                <div className="change-meta">
                <span
                  className="status-badge"
                  style={{ background: getStatusColor(pc.status) }}
                >
                  {COURSE_STATUS_LABEL[pc.status.toUpperCase()] || pc.status}
                </span>
                  <small className="created-at">Ngày tạo: {formatDate(pc.createdAt)}</small>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === pc.pendingChangeId && (
                <div className="change-details">
                  {/* Add Sections */}
                  {pc.changeData.addSections && pc.changeData.addSections.length > 0 && (
                    <div className="change-group">
                      <h5>Thêm chương ({pc.changeData.addSections.length})</h5>
                      {pc.changeData.addSections.map((sec, i) => (
                        <div key={i} className="change-item add">
                          <strong>{sec.title}</strong>
                          {sec.description && <p>{sec.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Contents */}
                  {pc.changeData.addContents && pc.changeData.addContents.length > 0 && (
                    <div className="change-group">
                      <h5>Thêm bài học ({pc.changeData.addContents.length})</h5>
                      {pc.changeData.addContents.map((content, i) => (
                        <div key={i} className="change-item add">
                          <strong>{content.title}</strong>
                          <small>Trong chương ID: {content.section_id}</small>
                          {content.files?.[0]?.url && (
                            <img
                              src={content.files[0].url}
                              alt={content.files[0].title}
                              className="lesson-thumb"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 6,
                                marginTop: 6,
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  {pc.status === "draft" && (
                    <button
                      className="submit-review-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmit(pc.pendingChangeId);
                      }}
                      disabled={submitting === pc.pendingChangeId}
                    >
                      {submitting === pc.pendingChangeId ? (
                        <>
                          <span className="spinner"></span> Đang gửi...
                        </>
                      ) : (
                        "Gửi để xem xét"
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <FloatingBackButton/>
    </div>
  );
}
