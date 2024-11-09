import React from "react";
import CourseCard from "../courses/CourseCard";
import LoaderGridCourses from "../common/LoaderGridCourses";

const CourseGrid = ({ courses, onIconClick, onCourseSelect, isLoading }) => {
  if (isLoading) {
    return <LoaderGridCourses />;
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
