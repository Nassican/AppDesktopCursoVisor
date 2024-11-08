import React from "react";
import { Folder } from "lucide-react";
import * as SiIcons from "react-icons/si";
import LoadingState from "./LoadingState";
import ProgressBarCourse from "../../../Home/courses/ProgressBarCourse";

const EmptyStateView = ({ courseInfo, isLoading = false }) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        {courseInfo && (
          <div className="mb-8 flex flex-col items-center transition-all duration-300 ease-in-out">
            {courseInfo.icon && SiIcons[courseInfo.icon] ? (
              <div className="transform transition-transform hover:scale-105">
                {SiIcons[courseInfo.icon]({
                  size: 256,
                  className: "text-blue-500 mb-4",
                })}
              </div>
            ) : (
              <Folder
                size={256}
                className="text-blue-500 mb-4 transform transition-transform hover:scale-105"
              />
            )}
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {courseInfo.name}
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              Selecciona un archivo para visualizarlo
            </p>
            <div className="text-lg text-gray-500 w-full">
              <ProgressBarCourse
                filesWatched={courseInfo.filesWatched}
                totalFiles={courseInfo.totalFiles}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyStateView;
