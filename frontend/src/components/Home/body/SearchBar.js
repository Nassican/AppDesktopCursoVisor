import React from "react";
import { SearchIcon } from "lucide-react";

const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Buscar cursos..."
      value={value}
      onChange={onChange}
      className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
  </div>
);

export default SearchBar;
