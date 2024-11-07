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
    <div key={currentPath}>
      <div className="w-full">
        <div
          className={`cursor-pointer p-2 hover:bg-gray-100 w-full ${
            isExpanded ? "bg-gray-200" : ""
          }`}
          onClick={() => toggleFolder(currentPath)}
        >
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 w-6">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
            <Folder size={16} className="flex-shrink-0 mr-2 text-blue-500" />
            <span className="flex-grow mr-4" title={folderName}>
              {folderName}
            </span>
          </div>
          <div className="ml-6 mr-4 flex items-center gap-2">
            <ProgressBarFolder
              progress={folderProgress}
              showPercentage={true}
            />
          </div>
        </div>
      </div>
      {isExpanded && <div>{children}</div>}
    </div>
  );
};

export default FolderItem;
