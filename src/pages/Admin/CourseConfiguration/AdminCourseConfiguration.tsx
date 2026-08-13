import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Layers3,
  Search,
  X,
} from "lucide-react";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { iapAdminService } from "@/services/Iap/iapAdminService";
import type {
  IapCourseContentAccess,
  IapSectionAccess,
} from "@/types/Iap/iapAdmin.type";
import "./AdminCourseConfiguration.css";

type CourseRow = {
  courseId: string;
  title: string;
  contentEnabled: boolean;
};

function errorMessage(error: unknown, fallback: string) {
  const value = error as { response?: { data?: { message?: string } }; message?: string };
  return value.response?.data?.message || value.message || fallback;
}

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`course-config-toggle ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

export default function AdminCourseConfiguration() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [details, setDetails] = useState<Record<string, IapCourseContentAccess>>({});
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await iapAdminService.getCourses({ page: 1, limit: 100 });
        setCourses(
          response.courses.map((item) => ({
            courseId: String(item.courseId),
            title: String(item.title ?? "Khóa học chưa đặt tên"),
            contentEnabled: Boolean(item.contentEnabled),
          })),
        );
      } catch (error) {
        showToast(errorMessage(error, "Không thể tải danh sách khóa học"), "error");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const visibleCourses = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");
    if (!keyword) return courses;
    return courses.filter((course) => course.title.toLocaleLowerCase("vi").includes(keyword));
  }, [courses, search]);

  const setBusyKey = (key: string, value: boolean) => {
    setBusy((current) => (value ? [...current, key] : current.filter((item) => item !== key)));
  };

  const loadDetail = async (courseId: string) => {
    if (details[courseId]) return details[courseId];
    const detail = await iapAdminService.getContentAccess(courseId);
    setDetails((current) => ({ ...current, [courseId]: detail }));
    return detail;
  };

  const toggleCourseExpanded = async (courseId: string) => {
    if (expandedCourses.includes(courseId)) {
      setExpandedCourses((current) => current.filter((id) => id !== courseId));
      return;
    }
    setBusyKey(`load-${courseId}`, true);
    try {
      await loadDetail(courseId);
      setExpandedCourses((current) => [...current, courseId]);
    } catch (error) {
      showToast(errorMessage(error, "Không thể tải nội dung khóa học"), "error");
    } finally {
      setBusyKey(`load-${courseId}`, false);
    }
  };

  const toggleCourse = async (course: CourseRow, enabled: boolean) => {
    const key = `course-${course.courseId}`;
    setBusyKey(key, true);
    try {
      const detail = await iapAdminService.updateCourseContentEnabled(course.courseId, enabled);
      setCourses((current) =>
        current.map((item) =>
          item.courseId === course.courseId ? { ...item, contentEnabled: enabled } : item,
        ),
      );
      setDetails((current) => ({ ...current, [course.courseId]: detail }));
      if (enabled) setExpandedCourses((current) => Array.from(new Set([...current, course.courseId])));
      showToast(enabled ? "Đã bật khóa học và toàn bộ nội dung" : "Đã tắt khóa học", "success");
    } catch (error) {
      showToast(errorMessage(error, "Không thể cập nhật khóa học"), "error");
    } finally {
      setBusyKey(key, false);
    }
  };

  const patchSection = (courseId: string, sectionId: string, patch: Partial<IapSectionAccess>) => {
    setDetails((current) => {
      const detail = current[courseId];
      if (!detail) return current;
      return {
        ...current,
        [courseId]: {
          ...detail,
          sections: detail.sections.map((section) =>
            section.sectionId === sectionId ? { ...section, ...patch } : section,
          ),
        },
      };
    });
  };

  const toggleSection = async (courseId: string, section: IapSectionAccess, isActive: boolean) => {
    const key = `section-${section.sectionId}`;
    setBusyKey(key, true);
    try {
      await iapAdminService.updateSectionAccess(courseId, section.sectionId, { isActive });
      patchSection(courseId, section.sectionId, { isActive });
    } catch (error) {
      showToast(errorMessage(error, "Không thể cập nhật chương"), "error");
    } finally {
      setBusyKey(key, false);
    }
  };

  const toggleLesson = async (
    courseId: string,
    section: IapSectionAccess,
    contentId: string,
    isActive: boolean,
  ) => {
    const key = `lesson-${contentId}`;
    setBusyKey(key, true);
    try {
      await iapAdminService.updateContentAccess(courseId, contentId, { isActive });
      patchSection(courseId, section.sectionId, {
        contents: section.contents.map((content) =>
          content.contentId === contentId ? { ...content, isActive } : content,
        ),
      });
    } catch (error) {
      showToast(errorMessage(error, "Không thể cập nhật bài giảng"), "error");
    } finally {
      setBusyKey(key, false);
    }
  };

  const toggleFile = async (
    courseId: string,
    section: IapSectionAccess,
    contentId: string,
    fileId: string,
    isActive: boolean,
  ) => {
    const key = `file-${fileId}`;
    setBusyKey(key, true);
    try {
      await iapAdminService.updateFileAccess(courseId, fileId, isActive);
      patchSection(courseId, section.sectionId, {
        contents: section.contents.map((content) =>
          content.contentId === contentId
            ? {
                ...content,
                files: content.files.map((file) =>
                  file.fileId === fileId ? { ...file, isActive } : file,
                ),
              }
            : content,
        ),
      });
    } catch (error) {
      showToast(errorMessage(error, "Không thể cập nhật tài liệu"), "error");
    } finally {
      setBusyKey(key, false);
    }
  };

  return (
    <div className="course-config-page">
      <header className="course-config-header">
        <div>
          <span>Cấu hình nội dung</span>
          <h1>Bật khóa học</h1>
          <p>Bật một khóa học sẽ mặc định bật toàn bộ chương, bài giảng và tài liệu bên trong.</p>
        </div>
        <label className="course-config-search">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm khóa học..." />
          {search && <button type="button" onClick={() => setSearch("")}><X size={15} /></button>}
        </label>
      </header>

      <div className="course-config-list">
        {loading ? (
          <div className="course-config-empty">Đang tải danh sách khóa học...</div>
        ) : visibleCourses.length === 0 ? (
          <div className="course-config-empty">Không tìm thấy khóa học.</div>
        ) : (
          visibleCourses.map((course) => {
            const expanded = expandedCourses.includes(course.courseId);
            const detail = details[course.courseId];
            return (
              <article key={course.courseId} className={`course-config-card ${course.contentEnabled ? "is-enabled" : ""}`}>
                <div className="course-config-course-row">
                  <button type="button" className="course-config-expand" onClick={() => void toggleCourseExpanded(course.courseId)}>
                    {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  <span className="course-config-course-icon"><Layers3 size={21} /></span>
                  <div className="course-config-course-name">
                    <strong>{course.title}</strong>
                    <small>{course.contentEnabled ? "Đang bật" : "Đang tắt"}</small>
                  </div>
                  <Toggle
                    checked={course.contentEnabled}
                    disabled={busy.includes(`course-${course.courseId}`)}
                    label={`Bật khóa học ${course.title}`}
                    onChange={(enabled) => void toggleCourse(course, enabled)}
                  />
                </div>

                {expanded && (
                  <div className="course-config-content">
                    {busy.includes(`load-${course.courseId}`) && !detail ? (
                      <div className="course-config-empty compact">Đang tải nội dung...</div>
                    ) : !detail?.sections.length ? (
                      <div className="course-config-empty compact">Khóa học chưa có nội dung.</div>
                    ) : (
                      detail.sections.map((section) => {
                        const sectionKey = `${course.courseId}-${section.sectionId}`;
                        const sectionOpen = expandedSections.includes(sectionKey);
                        return (
                          <div key={section.sectionId} className="course-config-section">
                            <div className="course-config-section-row">
                              <button
                                type="button"
                                className="course-config-expand small"
                                onClick={() => setExpandedSections((current) =>
                                  sectionOpen ? current.filter((key) => key !== sectionKey) : [...current, sectionKey]
                                )}
                              >
                                {sectionOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                              </button>
                              <BookOpen size={17} />
                              <strong>{section.title}</strong>
                              <label className="course-config-check">
                                <input
                                  type="checkbox"
                                  checked={section.isActive}
                                  disabled={!course.contentEnabled || busy.includes(`section-${section.sectionId}`)}
                                  onChange={(event) => void toggleSection(course.courseId, section, event.target.checked)}
                                />
                                Bật chương
                              </label>
                            </div>

                            {sectionOpen && (
                              <div className="course-config-lessons">
                                {section.contents.map((content) => (
                                  <div key={content.contentId} className="course-config-lesson">
                                    <label className="course-config-lesson-row">
                                      <input
                                        type="checkbox"
                                        checked={content.isActive}
                                        disabled={!course.contentEnabled || !section.isActive || busy.includes(`lesson-${content.contentId}`)}
                                        onChange={(event) => void toggleLesson(course.courseId, section, content.contentId, event.target.checked)}
                                      />
                                      <span>{content.title}</span>
                                      <small>Bài giảng</small>
                                    </label>
                                    {content.files.map((file) => (
                                      <label key={file.fileId} className="course-config-file-row">
                                        <input
                                          type="checkbox"
                                          checked={file.isActive}
                                          disabled={!course.contentEnabled || !section.isActive || !content.isActive || busy.includes(`file-${file.fileId}`)}
                                          onChange={(event) => void toggleFile(course.courseId, section, content.contentId, file.fileId, event.target.checked)}
                                        />
                                        <FileText size={14} />
                                        <span>{file.title}</span>
                                        <small>{file.fileType}</small>
                                      </label>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
