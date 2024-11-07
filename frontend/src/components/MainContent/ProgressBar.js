import React from "react";

const ProgressBar = ({ progress, isWatched = false }) => {
  return (
    <div className="ml-6 mr-4 bg-gray-200 rounded-full h-2 mb-2">
      <div
        className={`h-2 rounded-full ${
          isWatched ? "bg-green-500" : "bg-blue-600"
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
