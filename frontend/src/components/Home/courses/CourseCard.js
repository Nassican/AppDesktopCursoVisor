import React, { memo } from "react";
import { Folder } from "lucide-react";
import * as SiIcons from "react-icons/si";
import ProgressBar from "./ProgressBarCourse";

const CourseCard = memo(({ course, onIconClick, onCourseSelect }) => {
  const IconComponent =
    course.icon && SiIcons[course.icon] ? SiIcons[course.icon] : Folder;

  const handleIconClick = (e) => {
    e.stopPropagation();
    onIconClick(course);
  };

  const handleCourseSelect = () => {
    onCourseSelect(course.id);
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
      onClick={handleCourseSelect}
    >
      <div className="flex flex-1 items-center justify-start">
        <button
          onClick={handleIconClick}
          className="hover:bg-gray-200 rounded-lg p-2 group relative"
          aria-label="Cambiar icono del curso"
        >
          <IconComponent
            className="text-blue-500 min-w-10 min-h-10"
            size={24}
          />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Cambiar icono
          </span>
        </button>
        <div className="flex items-center ml-4">
          <h2 className="text-xl font-medium mb-2">{course.name}</h2>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <ProgressBar
          filesWatched={course.filesWatched}
          totalFiles={course.totalFiles}
        />
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";

export default CourseCard;
