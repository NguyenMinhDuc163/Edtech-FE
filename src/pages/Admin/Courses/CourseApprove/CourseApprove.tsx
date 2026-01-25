import { useEffect, useState } from "react";
import "./CourseApprove.css";
import { adminCourseApprovalService } from "@/services/Course/adminCourseApprovalService";
import type { Course } from "@/types/Course/course.type";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import AdminApprovalActions from "../components/Button/AdminApprovalActions";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { useLoadingStore } from "@/store/loadingStore";
import { COURSE_CATEGORY_LABEL } from "@/utils/ui/constants";
import defaultThumbnail from "@/assets/pictures/empty_course.png";

export default function CourseApprove() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();

  useEffect(() => {
    loadPending();
  }, []);

  async function loadPending() {
    setLoading(true);
    try {
      const res: any = await adminCourseApprovalService.getPending();

      const rawList = Array.isArray(res?.data) ? res.data : [];

      const safeData: Course[] = rawList.map((c: any) => {
        return {
          courseId: c.course_id || c.courseId,
          title: c.title,
          description: c.description,
          teacher: c.owner?.name || c.teacher || "N/A",
          category: c.category,
          thumbnailUrl: c.thumbnail_url,
          price: Number(c.price) || 0,
          currency: c.currency || "VND",
          courseDuration: c.course_duration || c.duration || "N/A",
        } as Course;
      });

      setCourses(safeData);
    } catch (err) {
      showToast("Không tải được danh sách khóa học chờ duyệt!", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleActionSuccess = () => {
    showToast("Đã xử lý yêu cầu thành công!", "success");
    loadPending();
  };

  return (
    <div className="admin-approve-container">
      <div className="admin-approve-header">
        <div className="header-left-group">
          <button
            className="admin-btn-back"
            onClick={() => navigate(-1)}
            title="Quay lại trang trước"
          >
            Quay lại
          </button>
          <h2 className="admin-approve-title">Duyệt khóa học</h2>
        </div>
        <button
          className="admin-btn-pending-change"
          onClick={() => navigate("/admin/courses/pending-changes")}
          title="Xem các thay đổi đang chờ duyệt"
        >
          Yêu cầu thay đổi chờ xử lý
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="admin-empty-state">
          Không có khóa học nào chờ duyệt.
        </div>
      ) : (
        <div className="admin-approve-table-wrapper">
          <table className="admin-approve-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "25%" }}>Khóa học</th>
                <th style={{ width: "15%" }}>Giảng viên</th>
                <th style={{ width: "15%" }}>Thể loại</th>
                <th style={{ width: "15%" }}>Giá trị</th>
                <th style={{ width: "10%" }}>Thời lượng</th>
                <th style={{ width: "15%" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={String(course.courseId)} className="admin-course-row">
                  <td data-label="#">{index + 1}</td>

                  <td data-label="Khóa học">
                    <div className="course-title-cell">
                      <img
                        src={course.thumbnailUrl || defaultThumbnail}
                        alt={course.title}
                        className="course-thumb"
                      />
                      <div className="course-text-info">
                        <span
                          className="course-main-title"
                          title={course.title}
                        >
                          {course.title}
                        </span>
                        <span
                          className="course-desc-preview"
                          title={course.description}
                        >
                          {course.description.substring(0, 50)}...
                        </span>
                      </div>
                    </div>
                  </td>

                  <td data-label="Giảng viên" className="teacher-info-cell">
                    <span className="teacher-email">
                      {course.teacher || "N/A"}
                    </span>
                  </td>

                  <td data-label="Thể loại">{COURSE_CATEGORY_LABEL[course.category]}</td>

                  <td data-label="Giá trị">
                    <div className="admin-price-info">
                      <span className="admin-price-value">
                        {formatCurrency(Number(course.price), course.currency)}
                      </span>
                    </div>
                  </td>

                  <td data-label="Thời lượng">
                    {course.courseDuration || "Chưa rõ"} Giờ
                  </td>

                  <td
                    data-label="Thao tác"
                    className="actions-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn-preview-course"
                      title="Xem chi tiết nội dung khóa học"
                      onClick={() =>
                        navigate(`/admin/courses/approve/${course.courseId}`)
                      }
                    >
                      <FaEye />
                    </button>
                    <AdminApprovalActions
                      courseId={String(course.courseId)}
                      redirectPath="/admin/courses/approve"
                      onSuccess={handleActionSuccess}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
