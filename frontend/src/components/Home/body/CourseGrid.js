import React from "react";
import CourseCard from "../courses/CourseCard";
import LoaderGridCourses from "../common/LoaderGridCourses";
import ErrorGridCourses from "../common/ErrorGridCourses";
import EmptyGridCourses from "../common/EmptyGridCourses";
const CourseGrid = ({
  courses,
  onIconClick,
  onCourseSelect,
  isLoading,
  error,
  onRetry,
}) => {
  if (isLoading) {
    return <LoaderGridCourses />;
  }

  if (error) {
    return <ErrorGridCourses onRetry={onRetry} />;
  }

  if (!courses || courses.length === 0) {
    return <EmptyGridCourses />;
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
