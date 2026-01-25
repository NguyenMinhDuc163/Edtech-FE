import React from "react";
import "./page.css";
import CourseList from "./Components/CourseList/CourseList";
import RecommendedCourses from "./Components/RecommendedCourses/RecommendedCourses";
import PopularCourses from "./Components/PopularCourses/PopularCourses";
import CategoryHighlights from "@/pages/Student/Courses/Components/CategoryHighlights/components/CategoryHighlights";

const Courses: React.FC = () => {
  return (
    <div className="courses-wrapper">
      <CategoryHighlights />
      <RecommendedCourses />
      <PopularCourses />
      <CourseList />
    </div>
  );
};

export default Courses;
