import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import GradientButton from "../../common/GradientButton";

const ErrorGridCourses = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-200px)]">
      <div className="max-w-xl w-full backdrop-blur-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform transition-all duration-300">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-500/50 p-4 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-50" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              No se pudieron cargar los cursos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hubo un problema al conectar con el servidor
            </p>
          </div>
          <GradientButton
            onClick={handleRetry}
            isExternalLink
            startColor="blue"
            endColor="indigo"
            icon={RefreshCcw}
            label="Abrir enlace"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorGridCourses;
