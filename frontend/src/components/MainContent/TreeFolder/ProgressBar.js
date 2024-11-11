import React from "react";

const ProgressBar = ({ progress, isWatched = false }) => {
  return (
    <div className="ml-6 mr-4 bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
          isWatched
            ? "bg-green-500 dark:bg-green-400"
            : "bg-blue-600 dark:bg-blue-400"
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
