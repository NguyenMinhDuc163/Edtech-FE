import "./TeacherCoursesPage.css";
import TeacherCourseList from "./Components/TeacherCourses/TeacherCourseList";
import { useNavigate } from "react-router-dom";

export default function TeacherCoursesPage() {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate("/teacher/courses/create");
  };
  const handleAISyllabus = () => {
    navigate("/teacher/courses/ai-syllabus");
  };

  return (
    <div className="teacher-course-container">
      {/* Header */}
      <div className="teacher-header">
        <h2>Quản lý khóa học</h2>

        <div className="header-actions">
          <button className="create-course-btn" onClick={handleCreateCourse}>
            + Tạo khóa học
          </button>
          <button
            className="ai-syllabus-btn"
            onClick={handleAISyllabus}
          >
            AI giáo trình
          </button>
          <button
            className="pending-changes-btn"
            onClick={() => navigate("/teacher/courses/pending-changes")}
          >
            Các thay đổi chờ duyệt
          </button>
        </div>
      </div>

      {/* Course List Component */}
      <TeacherCourseList />
    </div>
  );
}
