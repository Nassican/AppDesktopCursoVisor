import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-14 h-7 rounded-full 
        bg-gradient-to-r
        ${
          isDark
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-gray-200 hover:bg-gray-300"
        }
        transition-all duration-300 ease-in-out
        shadow-inner
        focus:outline-none
      `}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Círculo deslizante */}
      <span
        className={`
          absolute left-1
          w-5 h-5 rounded-full
          transform transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-7 bg-gray-200" : "translate-x-0 bg-white"}
          shadow-md
        `}
      />

      {/* Iconos con animación de fade */}
      <span className="relative w-full h-full">
        <Moon
          className={`
            absolute left-1.5 top-1.5
            w-4 h-4 
            text-gray-500 dark:text-gray-300
            transition-opacity duration-300
            ${isDark ? "opacity-100" : "opacity-0"}
          `}
        />
        <Sun
          className={`
            absolute right-1.5 top-1.5
            w-4 h-4 
            text-yellow-900
            transition-opacity duration-300
            ${isDark ? "opacity-0" : "opacity-100"}
          `}
        />
      </span>
    </button>
  );
}

export default ThemeToggleButton;
