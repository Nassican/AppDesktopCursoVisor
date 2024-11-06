import React, { useState, useMemo } from "react";
import * as SiIcons from "react-icons/si";
import { Search, X } from "lucide-react";

const IconSelector = ({ isOpen, onClose, onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  const icons = useMemo(() => Object.keys(SiIcons), []);

  const filteredIcons = useMemo(() => {
    return icons.filter((iconName) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [icons, searchTerm]);

  if (!isOpen) return null;

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    onSelectIcon(iconName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Selecciona un icono
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar selector de iconos"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar icono..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="overflow-y-auto flex-grow">
          {filteredIcons.length > 0 ? (
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

export default IconSelector;
