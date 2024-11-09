import React from "react";
import { Folder } from "lucide-react";

const LoaderGridCourses = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="bg-blue-50/50 p-4 rounded-xl">
                  <Folder className="text-blue-200" size={32} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
            </div>

            {/* Barra de progreso skeleton con brillo */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="relative h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 rounded-full"
                  style={{
                    width: `${Math.random() * 100}%`,
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine absolute -left-full" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32 "></div>
                <div className="h-4 bg-gray-200 rounded w-12 "></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoaderGridCourses;
