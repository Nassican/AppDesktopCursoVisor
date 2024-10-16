import React, { useState, useMemo } from "react";
import * as SiIcons from "react-icons/si";

const IconSelector = ({ onClose, onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const icons = useMemo(() => Object.keys(SiIcons), []);

  const filteredIcons = useMemo(() => {
    return icons.filter((iconName) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [icons, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl max-h-[80vh] w-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Selecciona un icono</h2>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar icono..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-y-auto flex-grow">
          <div className="grid grid-cols-6 gap-4">
            {filteredIcons.map((iconName) => {
              const IconComponent = SiIcons[iconName];
              return (
                <button
                  key={iconName}
                  onClick={() => onSelectIcon(iconName)}
                  className="p-2 hover:bg-gray-100 rounded-lg flex flex-col items-center"
                >
                  <IconComponent size={32} />
                  <span className="text-xs mt-1 truncate w-full text-center">
                    {iconName.replace("Si", "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
