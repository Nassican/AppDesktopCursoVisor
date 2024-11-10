import React, { useState, useMemo, useEffect, useCallback } from "react";
import * as SiIcons from "react-icons/si";
import { Search, X } from "lucide-react";
import Loader from "../../common/Loader";

const IconSelector = ({ isOpen, onClose, onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const icons = useMemo(() => Object.keys(SiIcons), []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedIcon(null);
      setIsLoading(true);
    }
  }, [isOpen]);

  const filteredIcons = useMemo(() => {
    return icons.filter((iconName) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [icons, searchTerm]);

  const handleIconSelect = useCallback(
    (iconName) => {
      setSelectedIcon(iconName);
      onSelectIcon(iconName);
    },
    [onSelectIcon]
  );

  const handleClose = useCallback(() => {
    setSearchTerm("");
    setSelectedIcon(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Selecciona un icono
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar selector de iconos"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="relative mb-6">
          <div
            className={`
            relative flex items-center
            bg-white/80 backdrop-blur-lg
            rounded-2xl
            border-2 ${
              searchTerm
                ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                : "border-gray-100 shadow-sm"
            }
            transition-all duration-300 ease-in-out
            hover:border-blue-400/50
          `}
          >
            <div className="pl-4">
              <Search
                className={`
                h-5 w-5
                transition-all duration-300
                ${searchTerm ? "text-blue-500 scale-110" : "text-gray-400"}
                group-hover:text-blue-400
              `}
              />
            </div>

            <input
              type="text"
              placeholder="Buscar icono..."
              className="w-full py-3.5 px-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-offset-0 focus:outline-none transition-all text-[15px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="pr-4 pl-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-300 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="mt-4 text-gray-600">Cargando iconos...</p>
            </div>
          ) : filteredIcons.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {filteredIcons.map((iconName) => {
                const IconComponent = SiIcons[iconName];
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
                      ${
                        isSelected
                          ? "bg-blue-50 ring-2 ring-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                  >
                    <IconComponent
                      size={32}
                      className={`${
                        isSelected ? "text-blue-500" : "text-gray-700"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium truncate w-full text-center
                        ${isSelected ? "text-blue-500" : "text-gray-600"}`}
                    >
                      {iconName.replace("Si", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg font-medium">No se encontraron iconos</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(IconSelector);
