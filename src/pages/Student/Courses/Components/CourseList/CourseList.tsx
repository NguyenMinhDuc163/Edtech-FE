import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "@/services/Course/courseService";
import type { Course } from "@/types/Course/course.type";
import "./CourseList.css";
import { COURSE_CATEGORY_LABEL } from "@/utils/ui/constants";
import defaultThumbnail from "@/assets/pictures/empty_course.png";

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCoursesStudentRole();
        setCourses(res);
      } catch (err) {
        console.error("Error loading course:", err);
      }
    };
    fetchCourses();
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
  const handleSeeAll = () => {
    navigate("/search");
  };

  return (
    <div className="courses-section">
      <h2 className="section-title">
        Tất cả khóa học
      </h2>
      <button className="see-all-btn" onClick={handleSeeAll}>
        Xem tất cả
      </button>

      <div className="courses-list" ref={listRef}>
        {courses.map((course) => (
          <div
            className="course-card"
            key={course.courseId}
            onClick={() => handleCourseClick(course.courseId)}
          >
            <img 
              src={course.thumbnailUrl || defaultThumbnail} 
              alt={course.title}
              className="course-img" 
            />

            <div className="course-content">
              <div className="course-meta-top">
                <span className="course-tag">{COURSE_CATEGORY_LABEL[course.category]}</span>
                <span className="course-duration">{course.courseDuration}</span>
              </div>

              <h3 className="course-title">
                {course.title}
              </h3>

              <p className="course-desc">
                {course.description || "Chưa có mô tả cho khóa học này."}
              </p>

              <div className="course-footer">
                <div className="instructor">
                  <span className="instructor-name">{course.teacher}</span>
                </div>
                <div className="course-price">
                  <span className="new-price">
                    {formatVND(course.price)} {course.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="courses-footer">
        <div className="navigation">
          <button className="nav-btn prev" onClick={() => scroll("left")}>
            ←
          </button>
          <button className="nav-btn next" onClick={() => scroll("right")}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
