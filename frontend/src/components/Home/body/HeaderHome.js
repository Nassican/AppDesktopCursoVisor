import React from "react";
import { InfoIcon, GraduationCap } from "lucide-react";
import SearchBar from "./SearchBar";

const Header = ({ onAboutClick, searchValue, onSearchChange }) => (
  <header
    className="
      fixed 
      top-0 
      left-0
      right-0
      z-50
      w-full 
      backdrop-blur-sm
      bg-white/80
      border-b
      border-gray-200/80
      supports-[backdrop-filter]:bg-white/70
    "
  >
    <div className="max-w-7xl mx-auto py-4">
      <div className="flex flex-col gap-4">
        {/* Fila superior: Título y botón de info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-blue-900 p-2.5 rounded-lg">
              <GraduationCap className="text-blue-50 w-5 h-5" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                CursoVisor
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Explora y aprende organizadamente
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <SearchBar value={searchValue} onChange={onSearchChange} />
          </div>
          <button
            onClick={onAboutClick}
            aria-label="Acerca de la aplicación"
            className="
              p-2.5
              rounded-full
              hover:bg-blue-200
              transition-colors
              hover:shadow-md
            "
          >
            <InfoIcon className="w-5 h-5 text-blue-600 " />
          </button>
        </div>

        {/* Fila inferior: Barra de búsqueda */}
      </div>
    </div>
  </header>
);

export default Header;
