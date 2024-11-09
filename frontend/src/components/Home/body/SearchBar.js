import React, { useState, useEffect, useRef } from "react";
import { Search, X, Command } from "lucide-react";

const SearchBar = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detecta si es Windows (metaKey) o Command (metaKey) + K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); // Previene el comportamiento por defecto
        inputRef.current?.focus(); // Enfoca el input
      }

      // Opcional: ESC para quitar el foco
      if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current?.blur();
      }
    };

    // Agregar el event listener
    document.addEventListener("keydown", handleKeyDown);

    // Limpiar el event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className={`
          relative flex items-center
          bg-white/80 backdrop-blur-lg
          rounded-2xl
          border-2 ${
            isFocused
              ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
              : "border-gray-100 shadow-sm"
          }
          transition-all duration-300 ease-in-out
          hover:border-blue-400/50
        `}
      >
        {/* Icono de búsqueda */}
        <div className="pl-4">
          <Search
            className={`
              h-5 w-5
              transition-all duration-300
              ${isFocused ? "text-blue-500 scale-110" : "text-gray-400"}
              ${value ? "text-blue-500" : ""}
              group-hover:text-blue-400
            `}
          />
        </div>

        {/* Campo de búsqueda */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar cursos, temas o contenido..."
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full py-3.5 px-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-offset-0 focus:outline-none transition-all text-[15px]`}
        />

        {/* Atajo de teclado - Actualizado para mostrar Win/Cmd */}
        <div className="hidden sm:inline-flex items-center gap-1.5 mr-3 px-2.5 py-1.5 rounded-md bg-gray-100 border border-gray-200/50 select-none whitespace-nowrap">
          <Command className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {/Mac/.test(navigator.userAgent) ? "⌘ K" : "Ctrl + K"}
          </span>
        </div>

        {/* Botón de limpiar */}
        {value && (
          <button
            onClick={handleClear}
            className="pr-4 pl-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-300 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
