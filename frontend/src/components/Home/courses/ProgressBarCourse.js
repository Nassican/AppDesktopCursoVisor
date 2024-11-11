import React from "react";

const ProgressBarCourse = ({ filesWatched, totalFiles }) => {
  const progressPercentage = (filesWatched / totalFiles) * 100;
  const isComplete = filesWatched === totalFiles;

  return (
    <div className="w-full">
      <div className="relative">
        {/* Barra de fondo */}
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-2.5 shadow-inner">
          {/* Barra de progreso */}
          <div
            className={`h-full rounded-full transition-all duration-700 ease-in-out 
              ${
                isComplete ? "bg-green-500" : "bg-blue-500"
              } relative overflow-hidden`}
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Efecto de brillo */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine absolute -left-full" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {filesWatched} / {totalFiles} archivos vistos
          </span>
          <span
            className={`font-semibold ${
              isComplete
                ? "text-green-600 dark:text-green-500"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarCourse;
