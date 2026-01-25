import React from "react";
import { useNavigate } from "react-router-dom";
import "./searchdetail.css";
import type { Course } from "@/types/Course/course.type";
import { FormattedText } from "@/utils/ui/formatText/formattext";

interface Props {
  courses: Course[];
  query?: string;
}

const SearchDetail: React.FC<Props> = ({ courses, query = "" }) => {
  const navigate = useNavigate();
  const formatVND = (value: number | string | undefined) => {
    if (!value) return "0";
    return new Intl.NumberFormat("vi-VN").format(Number(value));
  };

  const handleCourseClick = (courseId: number | string | undefined) => {
    const id = Number(courseId);
    if (!courseId || isNaN(id) || id <= 0) {
      console.error("Invalid course ID, cannot navigate:", courseId);
      return;
    }
    navigate(`/student/course/${id}`);
  };

  if (!courses || courses.length === 0) {
    return (
      <div
        className="no-result"
        style={{ textAlign: "center", padding: "80px 20px", color: "#666" }}
      >
        <h3>Không tìm thấy khóa học nào</h3>
        {query && (
          <p>
            Bạn đã tìm: "<strong>{query}</strong>"
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="course-grid">
      {courses.map((course) => (
        <div
          key={course.courseId}
          className="course-card1"
          onClick={() => handleCourseClick(course.courseId)}
          style={{ cursor: "pointer" }}
        >
          <div className="course-img-wrapper">
            <img
              src={course.thumbnailUrl || "/default-course.jpg"}
              alt={course.title}
              className="course-img"
            />
          </div>

          <div className="course-info">
            <div className="course-meta">
              {course.category && (
                <span className="course-category">{course.category}</span>
              )}
              {course.courseDuration && (
                <span className="course-duration">{course.courseDuration}</span>
              )}
            </div>

            <h3 className="course-title1">{course.title}</h3>
            {course.description && (
              <FormattedText
                content={course.description}
                className="course-desc"
              />
            )}

            <div className="course-footer">
              <div className="instructor">
                <img
                  src={course.avatar || "/default-avatar.jpg"}
                  alt={course.teacher}
                  className="instructor-avatar"
                />
                <span className="instructor-name">{course.teacher}</span>
              </div>
              <div className="course-price">
                {course.discountAmount ? (
                  <>
                    <span className="old-price">
                      {formatVND(course.price)} {course.currency}
                    </span>
                    <span className="new-price">
                      {formatVND(course.discountAmount)} {course.currency}
                    </span>
                  </>
                ) : (
                  <span className="new-price">
                    {formatVND(course.price)} {course.currency}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchDetail;
