import React from "react";

const LoadingModal = ({ isOpen, message, subMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black dark:bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-blue-100 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-600 animate-spin shadow-lg"></div>
            </div>
          </div>
          <p className="mt-6 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            {message || "Cargando..."}
          </p>
          {subMessage && (
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {subMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
