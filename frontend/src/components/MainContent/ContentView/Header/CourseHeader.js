import React, { useState } from "react";
import { Folder, InfoIcon } from "lucide-react";
import * as SiIcons from "react-icons/si";
import AboutModal from "../../../common/AboutModal";

const CourseHeader = ({ courseInfo }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  if (!courseInfo) return null;

  const handleAboutClick = () => {
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <div className="flex-shrink-0 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        {courseInfo.icon && SiIcons[courseInfo.icon] ? (
          SiIcons[courseInfo.icon]({
            size: 24,
            className: "text-gray-500 mr-4",
          })
        ) : (
          <Folder size={24} className="text-gray-500 mr-4" />
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-500">
            {courseInfo.name}
          </h3>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleAboutClick}
          className="hover:bg-gray-300  rounded-full"
        >
          <InfoIcon size={24} className="text-gray-500" />
        </button>
        {isAboutOpen && (
          <AboutModal isOpen={isAboutOpen} onClose={handleAboutClick} />
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
