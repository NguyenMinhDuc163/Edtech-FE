import { useEffect, useState } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatDateTime } from "@/utils/date/formatDateTime";
import { adminCourseService } from "@/services/Course/adminCourseStatsService";
import { COLORS_ADMIN_PAGE } from "@/utils/ui/colors";
import "./style/AdminCourseStats.css";
import { useNavigate, useParams } from "react-router-dom";
import FilterSelect from "./components/FilterSelect";
import { useLoadingStore } from "@/store/loadingStore";

const AdminCourseStats = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    courseId: courseId,
    status: "",
    studentId: "",
    quizId: "",
  });

  const fetchResults = async (pageNum = 1) => {
    try {
      setLoading(true);

      const body: Record<string, any> = { ...filters };
      Object.keys(body).forEach((k) => {
        if (!body[k]) delete body[k];
      });

      const params = { page: pageNum, limit };
      const res = await adminCourseService.getCourseResults(params, body);
      setResults(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      console.error("Lỗi khi tải kết quả:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(page);
  }, [filters, page, limit]);

  const handlePageChange = (newPage: number) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  const passedCount = results.filter((r) => r.is_passed).length;
  const failedCount = results.length - passedCount;

  const chartData = [
    { name: "Đạt", value: passedCount },
    { name: "Trượt", value: failedCount },
  ];

  const avgScore =
    results.length > 0
      ? (
          results.reduce((acc, cur) => acc + parseFloat(cur.score || "0"), 0) /
          results.length
        ).toFixed(2)
      : 0;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-card">
        <button className="course-detail-back" onClick={() => navigate(-1)}>
          Quay lại
        </button>
        <h2 className="admin-dashboard-title"> Thống kê kết quả khóa học</h2>

        <div className="admin-dashboard-summary">
          <div className="summary-item">
            <h4>Tổng lượt làm</h4>
            <p>{results.length}</p>
          </div>
          <div className="summary-item">
            <h4>Đạt</h4>
            <p className="text-passed">{passedCount}</p>
          </div>
          <div className="summary-item">
            <h4>Trượt</h4>
            <p className="text-failed">{failedCount}</p>
          </div>
          <div className="summary-item">
            <h4>Điểm TB</h4>
            <p>{avgScore}</p>
          </div>
        </div>

        <div className="admin-dashboard-chart">
          <h3>Biểu đồ tỷ lệ kết quả</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS_ADMIN_PAGE[index % COLORS_ADMIN_PAGE.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-dashboard-table-wrapper">
          <table className="admin-dashboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Học viên</th>
                <th>Bài kiểm tra</th>
                <th>Lần làm</th>
                <th>Điểm</th>
                <th>
                  Trạng thái
                  <FilterSelect
                    value={filters.status}
                    onChange={(val) => {
                      setFilters((prev) => ({ ...prev, status: val }));
                      setPage(1);
                    }}
                  />
                </th>
                <th>Kết quả</th>
                <th>Hoàn thành</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data">
                    Không có dữ liệu thống kê
                  </td>
                </tr>
              ) : (
                results.map((item, idx) => (
                  <tr key={item.result_id}>
                    <td>{idx + 1}</td>
                    <td>{item.student.username}</td>
                    <td>{item.quiz.quiz_title}</td>
                    <td>{item.attempt_number}</td>
                    <td>{item.score}</td>
                    <td>{item.status}</td>
                    <td className={item.is_passed ? "passed" : "failed"}>
                      {item.is_passed ? "Đạt" : "Trượt"}
                    </td>
                    <td>{formatDateTime(item.completed_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="admin-dashboard-pagination">
            <button
              className="admin-pagination-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              ← Trước
            </button>
            <span>
              Trang {page}/{pagination.totalPages}
            </span>
            <button
              className="admin-pagination-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseStats;
