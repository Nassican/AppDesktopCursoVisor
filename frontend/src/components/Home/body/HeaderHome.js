import React from "react";
import { InfoIcon, GraduationCap, Moon, Sun } from "lucide-react";
import SearchBar from "./SearchBar";
import { useTheme } from "../../../context/ThemeContext";

function Header({ onAboutClick, searchValue, onSearchChange }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
    w-full 
    bg-white/40 dark:bg-slate-800
    border-b 
    border-gray-200/80 dark:border-slate-700
    backdrop-blur-2xl
    backdrop-saturate-150
    supports-[backdrop-filter]:bg-white/30 dark:supports-[backdrop-filter]:bg-slate-800/30
    z-50
  "
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-6 xl:px-6 2xl:px-0">
        <div className="flex flex-col gap-4">
          {/* Fila superior: Título y botón de info */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full">
            <div className="flex items-center gap-3 w-full sm:w-auto mb-4 sm:mb-0 justify-between sm:justify-start">
              <div className="bg-blue-900 dark:bg-blue-600 p-2.5 rounded-lg hidden sm:block">
                <GraduationCap className="text-blue-50 w-5 h-5" />
              </div>

              <div className="flex flex-col justify-start ml-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 text-left">
                  CursoVisor
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-left sm:text-left">
                  Explora y aprende organizadamente
                </p>
              </div>
              <button
                onClick={onAboutClick}
                aria-label="Acerca de la aplicación"
                className="p-2.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors hover:shadow-md block sm:hidden"
              >
                <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 w-full sm:flex-1 sm:justify-end">
              <div className="flex-1 max-w-xl sm:ml-2 sm:max-w-none">
                <SearchBar value={searchValue} onChange={onSearchChange} />
              </div>
              <button
                onClick={onAboutClick}
                aria-label="Acerca de la aplicación"
                className="p-2.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors hover:shadow-md hidden sm:block"
              >
                <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:bg-white/10"
                title={
                  theme === "light"
                    ? "Cambiar a modo oscuro"
                    : "Cambiar a modo claro"
                }
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 " />
                ) : (
                  <Sun className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Fila inferior: Barra de búsqueda */}
        </div>
      </div>
    </header>
  );
}

export default Header;
