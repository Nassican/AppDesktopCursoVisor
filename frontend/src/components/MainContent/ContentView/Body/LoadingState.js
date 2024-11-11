import React from "react";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
