import React from "react";
import { Folder } from "lucide-react";
import * as SiIcons from "react-icons/si";

const CourseHeader = ({ courseInfo }) => {
  if (!courseInfo) return null;

  return (
    <div className="flex-shrink-0 mb-4 flex items-center">
      {courseInfo.icon && SiIcons[courseInfo.icon] ? (
        SiIcons[courseInfo.icon]({
          size: 24,
          className: "text-gray-500 mr-4",
        })
      ) : (
        <Folder size={24} className="text-gray-500 mr-4" />
      )}
      <div>
        <h3 className="text-lg font-medium text-gray-500">{courseInfo.name}</h3>
      </div>
    </div>
  );
};

export default CourseHeader;
