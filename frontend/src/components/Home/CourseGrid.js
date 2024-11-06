import React from "react";
import CourseCard from "./CourseCard";

const CourseGrid = ({ courses, onIconClick, onCourseSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="animate-pulse bg-white p-6 rounded-lg shadow-md h-40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onIconClick={onIconClick}
          onCourseSelect={onCourseSelect}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
