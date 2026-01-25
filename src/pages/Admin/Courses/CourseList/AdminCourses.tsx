import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./style/AdminCourses.css";

import { adminCourseService } from "@/services/Course/adminCourseStatsService";
import type { Course } from "@/types/Course/course.type";
import type { Pagination } from "@/utils/interface/pagination.interface";
import AdminCourseList from "./components/AdminCourseList";
import CourseFilters from "./components/AdminCourseFilters";
import { useLoadingStore } from "@/store/loadingStore";

export default function AdminCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [, setPagination] = useState<Pagination | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, any>>({
    status: "",
    query: "",
    visibility: "",
    title: "",
  });

  const fetchCourses = async (p = page, l = limit, f = filters) => {
    try {
      setLoading(true);
      const params: any = { page: Number(p), limit: Number(l) };
      if (f.status) params.status = f.status;
      if (f.visibility) params.visibility = f.visibility;
      if (f.title) params.title = f.title;
      if (f.query) params.query = f.query;

      const res = await adminCourseService.getAdminCourses(params);
      setCourses(res.courses || []);
      setPagination(res.pagination || null);
    } catch (err) {
      console.error("Load courses error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, limit, filters]);

  const openEdit = (_course: Course) => {
  };

  return (
    <div className="admin-course-page">
      <div className="admin-course-container">
        <header className="admin-course-header">
          <h2 className="admin-course-title">Danh sách khóa học</h2>

          <div className="admin-course-actions">
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => navigate("/admin/courses/approve")}
            >
              Duyệt khóa học
            </button>
            <button className="admin-btn" onClick={() => fetchCourses(1)}>
              Làm mới
            </button>
          </div>
        </header>

        <section className="admin-course-filters-section">
          <CourseFilters
            value={filters}
            onChange={(f: any) => {
              setFilters(f);
              setPage(1);
            }}
          />
        </section>

        <section className="admin-course-list-section">
          <div className="admin-course-list-toolbar">
            <div className="admin-course-pagination-select">
              <label>
                Hiển thị
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} / trang
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <AdminCourseList
            courses={courses}
            onEdit={openEdit}
          />
        </section>
      </div>
    </div>
  );
}
