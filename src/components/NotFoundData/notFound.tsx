import React from "react";
import "./notFound.css";

interface SkeletonCourseListProps {
  count?: number;
  variant?: "compact" | "default";
}

const SkeletonCourseList: React.FC<SkeletonCourseListProps> = ({
  count = 5,
  variant = "default",
}) => {
  return (
    <div className={`course-list-skeleton ${variant}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="course-item-skeleton">
          <div className="thumbnail-skeleton" />
          <div className="content-skeleton">
            <div className="line title" />
            <div className="line subtitle" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCourseList;
