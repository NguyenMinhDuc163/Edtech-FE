import { useEffect, useState } from "react";
import "./TeacherCourseList.css";
import { getUserCourses } from "@/services/Course/getTeacherCoursesService";
import { Link } from "react-router-dom";
import type { Course } from "@/types/Course/course.type";
import CourseSearch from "@/components/SearchCourse/SearchCourse";
import { useLoadingStore } from "@/store/loadingStore";
import { COURSE_STATUS_LABEL } from "@/utils/ui/constants";
import defaultThumbnail from "@/assets/pictures/empty_course.png";

export default function TeacherCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getUserCourses();
        if (result?.status === 200 && Array.isArray(result.data)) {
          setCourses(result.data);
          setFilteredCourses(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <CourseSearch courses={courses} onFilter={setFilteredCourses} />

      {filteredCourses.length === 0 ? (
        <p className="no-course-message">Không tìm thấy khóa học nào</p>
      ) : (
        <div className="course-list">
          {filteredCourses.map(course => (
            <Link key={course.courseId} to={`/teacher/courses/${course.courseId}`}>
              <div className="course-card">
                <img
                  src={course.thumbnailUrl || defaultThumbnail}
                  alt={course.title}
                  className="course-thumbnail"
                />
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description || "Chưa có mô tả"}</p>
                {COURSE_STATUS_LABEL[course.status] && <div className="status-badge">{COURSE_STATUS_LABEL[course.status]}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
