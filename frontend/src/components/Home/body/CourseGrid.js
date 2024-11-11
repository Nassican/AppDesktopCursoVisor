import React from "react";
import CourseCard from "../courses/CourseCard";
import LoaderGridCourses from "../common/LoaderGridCourses";
import ErrorGridCourses from "../common/ErrorGridCourses";

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
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No hay cursos disponibles
          </p>
        </div>
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
