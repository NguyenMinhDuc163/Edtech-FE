import React, { useEffect, useState } from "react";
import "../style/CategoryHighlights.css";
import { courseService } from "@/services/Course/courseService";
import { getStyleByCategory } from "../libs/mapStyle";
import { COURSE_CATEGORY_LABEL } from "@/utils/ui/constants";
import type { CategoryStat } from "../libs/interface";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDraggableScroll } from "../libs/useDraggableScroll";
import { useNavigate } from "react-router-dom";
import { useLoadingStore } from "@/store/loadingStore";
import SkeletonCourseList from "@/components/NotFoundData/notFound";
import { useToast } from "@/components/Notification/common/ToastProvider";

const CategoryHighlights: React.FC = () => {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loading = useLoadingStore((state) => state.isLoading);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { ref: scrollRef, ...dragEvents } = useDraggableScroll();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCategorySummary();
        setStats(data);
      } catch (error) {
        showToast("Có lỗi trong quá trình lấy dữ liệu", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 304;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (categoryKey: string) => {
    navigate(`/search?category=${categoryKey}`);
  };

  if (loading) {
    return <SkeletonCourseList variant="compact" count={3} />;
  }

  return (
    <div className="category-stats-section">
      <div className="stats-header">
        <h2>Khám phá kho tàng kiến thức</h2>
        <p>Hàng chục khóa học và video chất lượng đang chờ đón bạn</p>
      </div>

      <div className="stats-carousel-wrapper">
        {stats.length > 3 && (
          <button
            className="nav-btn prev"
            onClick={() => handleScroll("left")}
            aria-label="Scroll Left"
          >
            <FaChevronLeft />
          </button>
        )}

        <div className="category-stats-grid" ref={scrollRef} {...dragEvents}>
          {stats.map((item, index) => {
            const style = getStyleByCategory(item.category);
            const displayLabel =
              COURSE_CATEGORY_LABEL[
                item.category as keyof typeof COURSE_CATEGORY_LABEL
              ] || item.category;
            return (
              <div
                key={index}
                className="stat-card"
                onClick={() => handleCardClick(item.category)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="stat-icon-wrapper"
                  style={{
                    backgroundColor: `${style.color}15`,
                    color: style.color,
                  }}
                >
                  <span className="stat-icon">{style.icon}</span>
                </div>

                <h3 className="stat-category-title">{displayLabel}</h3>

                <div className="stat-metrics">
                  <div className="metric-item">
                    <span className="metric-value">{item.totalCourses}</span>
                    <span className="metric-label">Khóa học</span>
                  </div>

                  <div className="metric-divider"></div>

                  <div className="metric-item">
                    <span className="metric-value">{item.totalVideos}</span>
                    <span className="metric-label">Videos</span>
                  </div>

                  <div className="metric-divider"></div>

                  <div className="metric-item">
                    <div className="rating-box">
                      <span
                        className="rating-value"
                        style={{ color: style.color }}
                      >
                        {item.avgRating > 0 ? item.avgRating.toFixed(1) : "5.0"}
                      </span>
                    </div>
                    <span className="metric-label">Đánh giá</span>
                  </div>
                </div>

                <div className="stat-footer">
                  {item.totalStudents > 0 ? (
                    <span className="student-count">
                      👥 <strong>{item.totalStudents}</strong> học viên
                    </span>
                  ) : (
                    <span className="student-count highlight">
                      ✨ Mới ra mắt
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {stats.length > 3 && (
          <button
            className="nav-btn next"
            onClick={() => handleScroll("right")}
            aria-label="Scroll Right"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryHighlights;
