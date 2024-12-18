import React from "react";
import ProgressBar from "./ProgressBar";

const FileItem = ({
  currentPath,
  icon,
  showProgress,
  isWatched,
  filePath,
  handleWatchedChange,
  fileName,
  progressPercentage,
  onSelect,
  value,
}) => {
  return (
    <div className="flex flex-col w-full pl-2">
      <div className="hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg">
        <div
          className="cursor-pointer p-2 pl-5"
          onClick={() => onSelect(value.type, value.path)}
        >
          <div className="flex items-center mb-2">
            {React.cloneElement(icon, {
              size: 16,
              className: `mr-2 ${icon.props.className}`,
            })}
            {showProgress ? (
              <input
                type="checkbox"
                checked={isWatched}
                onChange={(e) =>
                  handleWatchedChange(filePath, e.target.checked)
                }
                className="ml-2 mr-2"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="ml-4"></div>
            )}
            <span
              className="truncate text-gray-800 dark:text-gray-300"
              title={fileName}
            >
              {fileName}
            </span>
          </div>
          {showProgress && (
            <ProgressBar progress={progressPercentage} isWatched={isWatched} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileItem;
