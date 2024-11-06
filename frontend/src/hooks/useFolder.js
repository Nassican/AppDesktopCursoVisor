import { useState } from "react";

export const useFolder = () => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      if (prev[path]) {
        const newExpandedFolders = { ...prev };
        delete newExpandedFolders[path];
        return newExpandedFolders;
      }
      return {
        ...prev,
        [path]: true,
      };
    });
  };

  return {
    expandedFolders,
    setExpandedFolders,
    toggleFolder,
  };
};
