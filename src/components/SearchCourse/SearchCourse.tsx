import { useState } from "react";
import type { Course } from "@/types/Course/course.type";
import "./CourseSearch.css";

interface CourseSearchProps {
  courses: Course[];
  onFilter: (filtered: Course[]) => void;
}

export default function CourseSearch({ courses, onFilter }: CourseSearchProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    filterCourses(value, statusFilter);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterCourses(query, value);
  };

  const filterCourses = (searchText: string, status: string) => {
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchText.toLowerCase())
    );

    if (status !== "ALL") {
      filtered = filtered.filter(course => course.status === status);
    }

    onFilter(filtered);
  };

  return (
    <div className="course-search-container">
      <input
        type="text"
        placeholder="Tìm kiếm khóa học..."
        value={query}
        onChange={handleChange}
        className="course-search-input"
      />
      <select
        value={statusFilter}
        onChange={handleStatusChange}
        className="course-status-filter"
      >
        <option value="ALL">Tất cả</option>
        <option value="DRAFT">Bản nháp</option>
        <option value="APPROVED">Đã duyệt</option>
        <option value="REJECTED">Bị từ chối</option>
        <option value="PENDING">Đang chờ duyệt</option>
      </select>
    </div>
  );
}
