import React from "react";
import { FileTextIcon as FilePdf, Download } from "lucide-react";

const PDFViewer = ({ filePath }) => {
  return (
    <div className="flex-1 bg-white rounded-lg overflow-hidden flex flex-col">
      <object data={filePath} type="application/pdf" className="w-full h-full">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <FilePdf size={64} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">
              No se puede mostrar el PDF
            </h3>
            <p className="text-gray-600 mb-4">
              Tu navegador no puede mostrar PDFs integrados.
            </p>
            <a
              href={filePath}
              download
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 
                text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Download size={16} className="mr-2" />
              Descargar PDF
            </a>
          </div>
        </div>
      </object>
    </div>
  );
};

export default React.memo(PDFViewer);
