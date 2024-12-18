import React from "react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import ProgressBarFolder from "./ProgressBarFolder";

const FolderItem = ({
  currentPath,
  isExpanded,
  toggleFolder,
  folderName,
  folderProgress,
  children,
}) => {
  return (
    <div key={currentPath} className="group">
      <div className="w-full">
        <div
          className={`
            cursor-pointer p-3 ml-1 mt-1 mb-1
            rounded-lg transition-all duration-200
            hover:bg-blue-50 hover:shadow-sm
            dark:hover:bg-gray-800
            ${isExpanded ? "bg-blue-100/50 dark:bg-gray-800 shadow-sm" : ""}
          `}
          onClick={() => toggleFolder(currentPath)}
        >
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 w-6 transition-transform duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {isExpanded ? (
                <ChevronDown
                  className="transform group-hover:scale-110 dark:text-gray-400"
                  size={16}
                />
              ) : (
                <ChevronRight
                  className="transform group-hover:scale-110 dark:text-gray-400"
                  size={16}
                />
              )}
            </div>
            <Folder
              size={16}
              className="flex-shrink-0 mr-2 text-blue-500 dark:text-blue-400 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-4 00 group-hover:scale-110"
            />
            <span
              className="flex-grow mr-4 font-medium truncate text-gray-800 dark:text-gray-300"
              title={folderName}
            >
              {folderName}
            </span>
          </div>
          <div className="ml-6 mr-4">
            <ProgressBarFolder
              progress={folderProgress}
              showPercentage={true}
            />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4 pl-0 border-l-2 border-blue-300 dark:border-blue-400 mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
