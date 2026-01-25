import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/MyCourses.css";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { courseService } from "@/services/Course/courseService";
import type { PurchasedCourse } from "@/types/Course/course.type";
import EMPTY_IMAGE from "@assets/pictures/empty_course.png";
import { FormattedText } from "@/utils/ui/formatText/formattext";

export default function MyCourses() {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await courseService.getPurchasedCourses();
        setCourses(data);
      } catch (error) {
        showToast(
          "Không thể tải danh sách khóa học của bạn. Vui lòng thử lại!",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, showToast]);

  const getProgressPercent = (value: string) => {
    const percent = parseFloat(value);
    return isNaN(percent) ? 0 : percent;
  };

  return (
    <div className="my-courses-page">
      <div className="my-courses-container">
        <header className="my-courses-header">
          <h1>Khóa học của tôi</h1>
          <p>Chào mừng trở lại! Hãy tiếp tục hành trình học tập của bạn.</p>
        </header>

        {courses.length > 0 ? (
          <div className="my-courses-grid">
            {courses.map((course) => {
              const percent = getProgressPercent(course.progress);
              return (
                <div key={course.registrationId} className="my-courses-card">
                  <div className="my-courses-image-wrapper">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="my-courses-thumbnail"
                    />
                    <div className="my-courses-category-badge">
                      {course.category}
                    </div>
                  </div>

                  <div className="my-courses-content">
                    <h3 className="my-courses-title" title={course.title}>
                      {course.title}
                    </h3>

                    <p className="my-courses-teacher">
                      Giảng viên: {course.teacher}
                    </p>
                    
                    <FormattedText
                      content={course.description}
                      className="my-courses-description"
                      maxLength={300}
                    />

                    <div className="my-courses-progress-section">
                      <div className="my-courses-progress-label">
                        <span>Đã hoàn thành</span>
                        <span>{percent}%</span>
                      </div>

                      <div className="my-courses-progress-bar-track">
                        <div
                          className="my-courses-progress-bar-fill"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="my-courses-footer">
                      <Link
                        to={`/student/learn/${course.courseId}`}
                        className="my-courses-btn-continue"
                      >
                        {percent > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-courses-empty-state">
            <img
              src={EMPTY_IMAGE}
              alt="No courses"
              className="my-courses-empty-img"
            />
            <h2>Bạn chưa đăng ký khóa học nào</h2>
            <p>
              Đừng bỏ lỡ cơ hội nâng cao kiến thức. Khám phá hàng trăm khóa học
              hấp dẫn ngay hôm nay!
            </p>
            <button
              className="my-courses-btn-explore"
              onClick={() => navigate("/student/courses")}
            >
              Khám phá khóa học ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
