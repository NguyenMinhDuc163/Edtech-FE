import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Send, Loader2, AlertCircle, Check } from "lucide-react";
import {
  getPendingChangeDetail,
  updateSectionInDraft,
  updateLessonInDraft,
  submitPendingChangeForReview,
} from "@/services/Course/TeacherPendingChangesService";
import "./DraftEdit.css";
import type { DraftData, SectionNested } from "@/types/Course/PendingHistoryParams";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { useLoadingStore } from "@/store/loadingStore";


const DraftEdit = () => {
  const { courseId, draftId } = useParams<{ courseId: string; draftId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [sections, setSections] = useState<SectionNested[]>([]);
  const [originalSections, setOriginalSections] = useState<SectionNested[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasUnsavedChanges = JSON.stringify(sections) !== JSON.stringify(originalSections);

  // Load draft
  useEffect(() => {
    if (!draftId) return;

    const fetchDraft = async () => {
      try {
        setLoading(true);
        const res = await getPendingChangeDetail(draftId);
        const draftData = res?.data?.data || res?.data || res;

        if (!draftData?.changeData?.sections) {
          throw new Error("Dữ liệu bản nháp không hợp lệ");
        }

        // THÊM uniqueId CHO TỪNG SECTION & LESSON
        const loadedSections = draftData.changeData.sections.map((section: any) => ({
          ...section,
          _uniqueId: section.temp_id || section.section_id || `section-${Math.random().toString(36)}`,
          contents: section.contents.map((lesson: any) => ({
            ...lesson,
            _uniqueId: lesson.temp_id || lesson.content_id || `lesson-${Math.random().toString(36)}`,
          }))
        }));

        setDraft(draftData);
        setSections(loadedSections);
        setOriginalSections(JSON.parse(JSON.stringify(loadedSections)));
      } catch (err: any) {
        showToast(err.message || "Không thể tải bản nháp", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [draftId, navigate]);

  // Hàm lưu thủ công
  const handleSaveChanges = async () => {
    if (saving || !hasUnsavedChanges) return;

    setSaving(true);
    const promises: Promise<any>[] = [];

    sections.forEach((section) => {
      // So sánh với original
      const origSection = originalSections.find(s =>
        (s.temp_id && s.temp_id === section.temp_id) ||
        (s.section_id && s.section_id === section.section_id)
      );

      // Lưu section (chỉ với section mới)
      if (section.type === "add" && section.temp_id && origSection && (
        origSection.title !== section.title ||
        origSection.description !== section.description
      )) {
        promises.push(
          updateSectionInDraft(draftId!, section.temp_id!, {
            title: section.title,
            description: section.description || "",
          })
        );
      }

      // Lưu từng lesson
      section.contents.forEach((content) => {
        const origContent = origSection?.contents.find(c =>
          (c.temp_id && c.temp_id === content.temp_id) ||
          (c.content_id && c.content_id === content.content_id)
        );

        if (origContent && (
          origContent.title !== content.title ||
          origContent.description !== content.description ||
          origContent.is_preview !== content.is_preview
        )) {
          const id = content.temp_id || content.content_id!;
          promises.push(
            updateLessonInDraft(draftId!, id, {
              title: content.title,
              description: content.description || "",
              is_preview: content.is_preview,
            })
          );
        }
      });
    });

    if (promises.length === 0) {
      setSaving(false);
      return;
    }

    try {
      await Promise.all(promises);
      showToast('Đã lưu tất cả thay đổi thành công!', "success");
      setOriginalSections(JSON.parse(JSON.stringify(sections))); // Cập nhật original
    } catch (err: any) {
      showToast("Lưu thất bại: " + (err.message || "Lỗi mạng"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm("Bạn chưa lưu thay đổi. Bạn có muốn lưu trước khi gửi duyệt không?");
      if (confirm) {
        await handleSaveChanges();
        if (saving) return; // Đang lưu → đợi xong mới gửi
      }
    }

    setSubmitting(true);
    try {
      await submitPendingChangeForReview(draftId!);
      showToast("Đã gửi duyệt thành công!", "success");
      navigate(`/teacher/courses/${courseId}/pendings-history`);
    } catch (err: any) {
      showToast('Đã gửi duyệt thất bại!', "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft || sections.length === 0) {
    return (
      <div className="empty-state">
        <p>Không có dữ liệu để chỉnh sửa</p>
      </div>
    );
  }

  return (
    <div className="draft-edit-container">
      <div className="draft-edit-wrapper">
        {/* Header */}
        <div className="draft-header">
          <div className="header-content">
            <div className="header-left">
              <div>
                <h1 className="page-title">
                  Bản nháp chỉnh sửa <span style={{ color: '#3b82f6' }}>#{draftId}</span>
                </h1>
                <p className="page-subtitle">
                  {hasUnsavedChanges ? (
                    <span style={{ color: "#ea580c", fontWeight: 600 }}>
                      <AlertCircle size={18} style={{ display: "inline", marginRight: 6 }} />
                      Bạn có thay đổi chưa lưu
                    </span>
                  ) : (
                    <span style={{ color: "#16a34a" }}>
                      <Check size={18} style={{ display: "inline", marginRight: 6 }} />
                      Đã lưu tất cả
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="header-right">
              {/* Nút Lưu - chỉ hiện khi có thay đổi */}
              {hasUnsavedChanges && (
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="save-btn"
                  style={{
                    background: saving ? "#94a3b8" : "linear-gradient(135deg, #f97316, #ea580c)",
                    marginRight: 12,
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Lưu
                    </>
                  )}
                </button>
              )}

              {/* Nút Gửi duyệt */}
              <button
                onClick={handleSubmitForReview}
                disabled={submitting}
                className="submit-btn"
              >
                <Send size={22} />
                {submitting ? "Đang gửi..." : "Gửi duyệt ngay"}
              </button>
            </div>
          </div>
        </div>

        {/* Admin Comment */}
        {draft.adminComment && (
          <div className="admin-feedback">
            <h3><AlertCircle size={32} /> Ghi chú từ Admin</h3>
            <p>{draft.adminComment}</p>
          </div>
        )}

        {/* Sections & Lessons */}
        <div>
          {sections.map((section) => (
            <div key={section.temp_id || section.section_id} className="section-card">
              <div className="section-detail-header">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => {
                    setSections(prev => prev.map(s =>
                      s._uniqueId === section._uniqueId
                        ? { ...s, title: e.target.value }
                        : s
                    ));
                  }}
                  className="section-title-input"
                  placeholder="Tiêu đề chương..."
                />
              </div>

              <div className="section-body">
                <textarea
                  value={section.description || ""}
                  onChange={(e) => {
                    setSections(prev => prev.map(s =>
                      s._uniqueId === section._uniqueId
                        ? { ...s, description: e.target.value }
                        : s
                    ));
                  }}
                  rows={3}
                  className="section-description"
                  placeholder="Mô tả chương..."
                />

                {section.contents.map((lesson) => (
                  <div key={lesson.temp_id || lesson.content_id} className="lesson-card">
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => {
                        setSections(prev => prev.map(sec => ({
                          ...sec,
                          contents: sec.contents.map(c =>
                            c._uniqueId === lesson._uniqueId
                              ? { ...c, title: e.target.value }
                              : c
                          )
                        })));
                      }}
                      className="lesson-title-input"
                      placeholder="Tiêu đề bài học"
                    />
                    <textarea
                      value={lesson.description || ""}
                      onChange={(e) => {
                        const newDesc = e.target.value;
                        setSections(prevSections =>
                          prevSections.map(sec => ({
                            ...sec,
                            contents: sec.contents.map(c =>
                              c === lesson
                                ? { ...c, description: newDesc }
                                : c
                            )
                          }))
                        );
                      }}
                      rows={2}
                      className="lesson-description"
                      placeholder="Mô tả ngắn gọn..."
                    />
                    <div className="lesson-meta">
                      <span>
                        {lesson.files?.length || 0} file
                        {lesson.files?.some(f => f.is_preview === "Y") && " • Có preview"}
                      </span>
                      <label className="preview-toggle">
                        <input
                          type="checkbox"
                          checked={lesson.is_preview === "Y"}
                          onChange={(e) => {
                            setSections(s => s.map(sec => ({
                              ...sec,
                              contents: sec.contents.map(c =>
                                (c.temp_id === lesson.temp_id || c.content_id === lesson.content_id)
                                  ? { ...c, is_preview: e.target.checked ? "Y" : "N" }
                                  : c
                              )
                            })));
                          }}
                        />
                        Xem trước miễn phí
                      </label>
                    </div>
                  </div>
                ))}

                {section.contents.length === 0 && (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", padding: "20px 0" }}>
                    Chưa có bài học nào trong chương này
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="page-footer">
          Cập nhật lần cuối: <strong>{new Date(draft.updatedAt).toLocaleString("vi-VN")}</strong>
        </div>
      </div>
    </div>
  );
};

export default DraftEdit;