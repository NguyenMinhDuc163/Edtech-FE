import React from "react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/types/Course/course.type";
import { formatDateTime } from "@/utils/date/formatDateTime";
import SkeletonCourseList from "@/components/NotFoundData/notFound";
import {
  COURSE_CATEGORY_LABEL,
  COURSE_STATUS_LABEL,
  COURSE_VISIBILITY_LABEL,
} from "@/utils/ui/constants";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { FormattedText } from "@/utils/ui/formatText/formattext";

interface AdminCourseListProps {
  courses?: Course[];
  onEdit: (course: Course) => void;
}

const AdminCourseList: React.FC<AdminCourseListProps> = ({
  courses,
  onEdit,
}) => {
  const navigate = useNavigate();

  if (!courses) {
    return <SkeletonCourseList variant="compact" count={3} />;
  }
  if (courses.length === 0) {
    return <div className="admin-course-empty">Không tìm thấy khóa học.</div>;
  }

  return (
    <div className="admin-course-list">
      {courses.map((course) => (
        <div key={course.courseId} className="admin-course-item">
          <div className="admin-course-info">
            <h3>{course.title}</h3>
            <FormattedText
              content={course.description}
              className="admin-course-desc"
              maxLength={300}
            />

            <div className="admin-course-meta">
              <p>
                <strong>Danh mục:</strong>{" "}
                {COURSE_CATEGORY_LABEL[course.category]}
              </p>
              <p>
                <strong>Giảng viên:</strong> {course.teacher ?? "Giáo viên"}
              </p>
              <p>
                <strong>Thời lượng:</strong>{" "}
                {course.courseDuration || "Đang cập nhật"}
              </p>
              <p>
                <strong>Giá:</strong>{" "}
                {formatCurrency(Number(course.price), course.currency)}
                {course.discountAmount && course.discountAmount > 0 && (
                  <span className="admin-course-discount">
                    {" "}
                    (Giảm {Number(course.discountAmount).toLocaleString()} %)
                  </span>
                )}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`admin-course-status ${course.status.toLowerCase()}`}
                >
                  {COURSE_STATUS_LABEL[course.status] ?? course.status}
                </span>
              </p>
              <p>
                <strong>Chế độ hiển thị:</strong>{" "}
                {COURSE_VISIBILITY_LABEL[course.visibility] ??
                  course.visibility}
              </p>
              <p>
                <strong>Tạo lúc:</strong> {formatDateTime(course.createdAt)}
              </p>
              <p>
                <strong>Người duyệt:</strong>{" "}
                {course.approved_by || "Quản trị viên"}
              </p>
              <p>
                <strong>Cập nhật:</strong> {formatDateTime(course.createdAt)}
              </p>
            </div>

            <div className="admin-course-buttons">
              <button
                onClick={() => navigate(`/admin/courses/${course.courseId}`)}
              >
                Chi tiết
              </button>
              <button onClick={() => onEdit(course)}>Sửa</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCourseList;
