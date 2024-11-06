import React from "react";
import { Archive, Download } from "lucide-react";

const ZIPViewer = ({ filePath }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <Archive size={64} className="mx-auto mb-4 text-purple-500" />
        <h3 className="text-lg font-medium mb-2">Archivo Comprimido</h3>
        <p className="text-gray-600 mb-4">
          Este archivo debe ser descargado para su visualización
        </p>
        <a
          href={filePath}
          download
          className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 
            text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Download size={16} className="mr-2" />
          Descargar ZIP
        </a>
      </div>
    </div>
  );
};

export default React.memo(ZIPViewer);
