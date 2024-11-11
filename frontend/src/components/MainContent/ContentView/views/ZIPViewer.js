import React from "react";
import { Archive, Download, File, FileText } from "lucide-react";
import GradientButton from "../../../common/GradientButton";

const ZIPViewer = ({ filePath, fileName }) => {
  // Función para obtener el icono según la extensión
  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="text-red-500" size={24} />;
      case "doc":
      case "docx":
        return <FileText className="text-blue-500" size={24} />;
      case "xls":
      case "xlsx":
        return <FileText className="text-green-500" size={24} />;
      default:
        return <File className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br">
      <div className="max-w-xl w-full backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-purple-200">
        {/* Icono principal */}
        <div className="relative mb-16">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl w-24 h-24 flex items-center justify-center shadow-lg border-4 border-white transform transition-transform hover:scale-105 hover:rotate-3">
              <Archive size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-8">
          {/* Título y descripción */}
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Archivo ZIP
            </h3>
            <p className="text-gray-600">
              Archivo comprimido listo para descargar
            </p>
          </div>

          {/* Información del archivo */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-sm border border-purple-100">
              <div className="p-3 bg-purple-50 rounded-lg">
                {getFileIcon(fileName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {fileName || "archivo.zip"}
                </p>
                <p className="text-sm text-gray-500">Archivo ZIP</p>
              </div>
            </div>
          </div>

          {/* Botón de descarga */}
          <div className="flex justify-center pt-4">
            <GradientButton
              href={filePath}
              startColor="purple"
              endColor="indigo"
              icon={Download}
              label="Descargar archivo"
              download={true}
            />
          </div>

          {/* Nota informativa */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              El archivo se descargará automáticamente al hacer clic en el botón
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ZIPViewer);
