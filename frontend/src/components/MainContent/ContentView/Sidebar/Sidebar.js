import React from "react";
import { Home as HomeIcon, ChevronLeft } from "lucide-react";

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
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {/* Botón para ocultar integrado en el header */}

              <h2 className="text-xl font-bold text-gray-800">
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
                  hover:bg-blue-50 transition-colors
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
                  transition-colors duration-200
                  flex items-center justify-center
                  md:hover:bg-gray-100/80
                  md:hover:shadow-sm
                "
                title={isOpen ? "Ocultar menú" : "Mostrar menú"}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
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
        "
        >
          {structure ? (
            renderTree(structure)
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Cargando estructura...</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={onToggle}
        />
      )}
    </div>
  );
};

export default Sidebar;
