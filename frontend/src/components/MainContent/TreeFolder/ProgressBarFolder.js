import React from "react";

const ProgressBarFolder = ({
  progress,
  isWatched = false,
  showPercentage = false,
}) => {
  const isComplete = progress >= 100;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-grow bg-gray-200 rounded-full h-1.5 shadow-inner">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 relative overflow-hidden
            ${isComplete || isWatched ? "bg-green-500" : "bg-blue-600"}`}
          style={{ width: `${progress}%` }}
        >
          {/* Efecto de brillo */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine absolute -left-full" />
          </div>
        </div>
      </div>
      {showPercentage && (
        <div
          className={`flex-shrink-0 min-w-[40px] text-xs font-semibold text-right
            ${isComplete || isWatched ? "text-green-600" : "text-blue-600"}`}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBarFolder;
