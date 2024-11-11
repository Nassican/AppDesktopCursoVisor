import React, { useState } from "react";
import { Folder, InfoIcon, Menu } from "lucide-react";
import * as SiIcons from "react-icons/si";
import AboutModal from "../../../common/AboutModal";
import ThemeToggleButton from "../../../common/ThemeToggleButton";

const CourseHeader = ({
  courseInfo,
  onToggleSidebar,
  isSidebarOpen,
  onHomeClick,
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  if (!courseInfo) return null;

  const handleAboutClick = () => {
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <div className="flex-shrink-0 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="
              py-2 pr-2 rounded-lg 
              transition-colors duration-200
              flex items-center justify-center
            "
            title="Mostrar menú"
          >
            <Menu
              size={24}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            />
          </button>
        )}
        <div className="flex items-center">
          <button
            onClick={onHomeClick}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
            title="Ir a la vista inicial del curso"
          >
            {courseInfo.icon && SiIcons[courseInfo.icon] ? (
              SiIcons[courseInfo.icon]({
                size: 24,
                className:
                  "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors duration-200",
              })
            ) : (
              <Folder
                size={24}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors duration-200"
              />
            )}
          </button>
          <div className="ml-2">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300 truncate max-w-[200px] md:max-w-none">
              {courseInfo.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={handleAboutClick}
          className="
            p-2 rounded-full
            hover:bg-gray-200
            dark:hover:bg-gray-700
            transition-colors duration-200
          "
          title="Información"
        >
          <InfoIcon size={24} className="text-gray-500 dark:text-gray-400" />
        </button>
        <ThemeToggleButton />
        {isAboutOpen && (
          <AboutModal isOpen={isAboutOpen} onClose={handleAboutClick} />
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
