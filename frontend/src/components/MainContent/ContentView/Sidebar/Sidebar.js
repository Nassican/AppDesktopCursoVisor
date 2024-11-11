import React from "react";
import { Home as HomeIcon, ChevronLeft } from "lucide-react";
import Loader from "../../../common/Loader";

const Sidebar = ({ structure, renderTree, goToHome, isOpen, onToggle }) => {
  return (
    <div
      className={`
        fixed md:relative
        h-full transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "w-full md:w-[320px] lg:w-[25vw] lg:max-w-[400px]" : "w-0"}
        bg-white border-r shadow-md overflow-hidden
        z-30
      `}
    >
      {/* Contenido del sidebar */}
      <div
        className={`
          h-full flex flex-col
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Header del Sidebar */}
        <div className="sticky top-0 z-10 bg-white border-b dark:bg-gray-900">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {/* Botón para ocultar integrado en el header */}

              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                <span className="hidden md:inline">CursoVisor</span>
                <span className="md:hidden">Menú</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToHome}
                className="
                  p-2 rounded-lg
                  text-blue-500 hover:text-blue-700
                  dark:text-blue-400 dark:hover:text-blue-300
                  hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200
                  flex items-center justify-center
                "
                title="Ir al inicio"
              >
                <HomeIcon size={24} />
              </button>
              <button
                onClick={onToggle}
                className="
                  p-2 rounded-lg
                  hover:bg-gray-100
                  dark:hover:bg-gray-700
                  transition-colors duration-200
                  flex items-center justify-center
                  md:hover:bg-gray-100/80
                  dark:md:hover:bg-gray-700/80
                  md:hover:shadow-sm
                "
                title={isOpen ? "Ocultar menú" : "Mostrar menú"}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del árbol */}
        <div
          className="
          overflow-y-auto flex-grow pb-10 p-0 
          custom-scrollbar
          
          overscroll-contain
          bg-gray-50 dark:bg-gray-900
        "
        >
          {structure ? (
            renderTree(structure)
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader message="Cargando estructura" />
            </div>
          )}
        </div>
      </div>

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-sm -z-10"
          onClick={onToggle}
        />
      )}
    </div>
  );
};

export default Sidebar;
