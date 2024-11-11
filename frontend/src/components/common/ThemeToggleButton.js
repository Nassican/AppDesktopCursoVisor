import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none bg-gray-200 dark:bg-gray-700 transition-colors"
      title={
        theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"
      }
    >
      <span
        className={`${
          theme === "light" ? "translate-x-1" : "translate-x-6"
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
      {theme === "light" ? (
        <Moon className="absolute left-1 w-4 h-4 text-gray-600" />
      ) : (
        <Sun className="absolute right-1 w-4 h-4 text-yellow-400" />
      )}
    </button>
  );
}

export default ThemeToggleButton;
