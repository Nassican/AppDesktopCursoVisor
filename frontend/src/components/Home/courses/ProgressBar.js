import React from "react";

const ProgressBar = ({ filesWatched, totalFiles }) => {
  const progressPercentage = (filesWatched / totalFiles) * 100;

  return (
    <>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">
        {filesWatched} / {totalFiles} archivos vistos
      </p>
    </>
  );
};

export default ProgressBar;
