import { useEffect, useState } from "react";
import { adminCourseService } from "@/services/Course/adminCourseStatsService";
import LeaderboardTable from "./components/LeaderboardTable";
import "./style/AdminLeaderboard.css";
import { useNavigate, useParams } from "react-router-dom";
import { useLoadingStore } from "@/store/loadingStore";

const AdminLeaderboardPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters] = useState({
    courseId: courseId,
  });

  const fetchLeaderboard = async (p = page, l = limit, f = filters) => {
    try {
      setLoading(true);
      const body: Record<string, any> = { ...filters };
      Object.keys(body).forEach((k) => {
        if (!body[k]) delete body[k];
      });
      const params: any = { page: Number(p), limit: Number(l) };
      if (f.courseId) params.courseId = f.courseId;
      const res = await adminCourseService.getCourseLeaderboard(params);
      console.log(res);
      setLeaderboard(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      console.error("Lỗi khi tải bảng xếp hạng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="admin-leaderboard-container">
      <div className="admin-leaderboard-card">
        <button className="course-detail-back" onClick={() => navigate(-1)}>
          Quay lại
        </button>
        <h2 className="admin-leaderboard-title">Bảng xếp hạng sinh viên</h2>

        <LeaderboardTable leaderboard={leaderboard} />

        {pagination && (
          <div className="admin-leaderboard-pagination">
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

export default AdminLeaderboardPage;
