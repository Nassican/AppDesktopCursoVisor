import React from "react";
import { InfoIcon } from "lucide-react";

const Header = ({ onAboutClick }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Cursos disponibles</h1>
    <button onClick={onAboutClick} className="bg-blue-100 p-2 rounded-full">
      <InfoIcon className="text-blue-500" size={24} />
    </button>
  </div>
);

export default Header;
