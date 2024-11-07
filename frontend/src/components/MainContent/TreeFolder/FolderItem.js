import React from "react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";

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
            <div className="flex-grow bg-gray-400 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${folderProgress}%` }}
              ></div>
            </div>
            <div className="flex-shrink-0 min-w-[40px] text-xs text-gray-500 text-right">
              {Math.round(folderProgress)}%
            </div>
          </div>
        </div>
      </div>
      {isExpanded && <div>{children}</div>}
    </div>
  );
};

export default FolderItem;
