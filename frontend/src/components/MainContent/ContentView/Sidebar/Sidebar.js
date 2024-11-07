import React from "react";
import { Home as HomeIcon } from "lucide-react";

const Sidebar = ({ structure, renderTree, goToHome }) => {
  return (
    <div className="w-1/4 bg-white border-r shadow-md flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">CursoVisor</h2>
          <button
            onClick={goToHome}
            className="text-blue-500 hover:text-blue-700"
          >
            <HomeIcon size={24} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow pb-10 p-0 custom-scrollbar">
        {structure ? (
          renderTree(structure)
        ) : (
          <p>Cargando estructura de carpetas...</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
