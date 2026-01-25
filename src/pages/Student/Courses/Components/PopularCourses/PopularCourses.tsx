import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "@/services/Course/courseService";
import "./PopularCourses.css";
import type { RecommendedCourse } from "@/types/Course/recommended-course.type";
import { FormattedText } from "@/utils/ui/formatText/formattext";
import defaultThumbnail from "@/assets/pictures/empty_course.png";

const PopularCourses = () => {
  const [courses, setCourses] = useState<RecommendedCourse[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopular = async () => {
      const res = await courseService.getPopularCourses(12);
      setCourses(res);
    };
    fetchPopular();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (listRef.current) {
      const scrollAmount = listRef.current.clientWidth;
      listRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const formatVND = (value: number | string | undefined) => {
    if (!value) return "0";
    return new Intl.NumberFormat("vi-VN").format(Number(value));
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/student/course/${courseId}`);
  };


  return (
    <div className="courses-section recommended-section">
      <h2 className="section-title">
        Khóa học phổ biến
      </h2>

      <div className="courses-list" ref={listRef}>
        {courses.map((course) => (
          <div
            className="course-card"
            key={course.courseId}
            onClick={() => handleCourseClick(course.courseId)}
            style={{ cursor: "pointer" }}
          >
            <img src={course.thumbnailUrl || defaultThumbnail} alt={course.title} className="course-img" />
            <div className="course-content">

              <h3 className="course-title">{course.title}</h3>
              <FormattedText
                content={course.description}
                className="course-desc"
              />
              <div className="course-footer">
                <div className="instructor">
                  <span className="instructor-name">{course.teacher}</span>
                </div>
                <div className="course-price">
                  {course.discountAmount ? (
                    <>
                      <span className="old-price">{formatVND(course.price)} {course.currency}</span>
                      <span className="new-price">{formatVND(course.discountAmount)} {course.currency}</span>
                    </>
                  ) : (
                    <span className="new-price">{formatVND(course.price)} {course.currency}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="courses-footer">
        <div className="navigation">
          <button className="nav-btn prev" onClick={() => scroll("left")}>←</button>
          <button className="nav-btn next" onClick={() => scroll("right")}>→</button>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;