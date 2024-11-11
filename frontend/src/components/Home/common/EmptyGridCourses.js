import React from "react";
import { FolderOpen, ArrowRight, RefreshCcw } from "lucide-react";
import GradientButton from "../../common/GradientButton";

const EmptyCourseState = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        {/* Icono principal con animación */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              <FolderOpen className="w-16 h-16 text-blue-500 dark:text-blue-400 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Título con gradiente */}
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          No hay cursos disponibles
        </h3>

        {/* Descripción mejorada */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Parece que aún no has agregado ningún curso.
          <span className="block mt-2">Sigue estos pasos para comenzar:</span>
        </p>

        {/* Pasos a seguir */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 mb-8">
          <ol className="text-left space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                1
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Abre la carpeta "cursos_videos" en tu sistema
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                2
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Agrega tus carpetas de cursos en la carpeta "cursos_videos"
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                3
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Recarga la página para ver tus cursos
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col  justify-center gap-4">
          <div className="flex justify-center">
            <GradientButton
              label="Recargar página"
              icon={RefreshCcw}
              startColor="blue"
              endColor="indigo"
              onClick={() => {
                window.location.reload();
              }}
              size="sm"
            />
          </div>

          {/* Enlace de ayuda */}
          <div className="flex justify-center">
            <a
              href="https://github.com/nassican"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors group"
            >
              ¿Necesitas ayuda?
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCourseState;
