import { ExternalLink, Link } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "../../../common/Loader";
import GradientButton from "../../../common/GradientButton";

const URLViewer = ({ filePath }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(filePath)
      .then((response) => response.text())
      .then((content) => {
        const match = content.match(/URL=(.+)/);
        if (match) setUrl(match[1]);
      })
      .catch((error) => console.error("Error loading URL file:", error))
      .finally(() => setIsLoading(false));
  }, [filePath]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br ">
        <Loader size="medium" color="blue" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br ">
      <div className="max-w-xl w-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-8 transform transition-all duration-300">
        {/* Icono principal */}
        <div className="relative mb-16">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-600 rounded-2xl w-24 h-24 flex items-center justify-center shadow-lg border-4 border-white dark:border-blue-900 transform transition-transform hover:scale-105 hover:rotate-3">
              <Link size={40} className="text-white dark:text-blue-100" />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-8">
          {/* Título y descripción */}
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r  from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 bg-clip-text text-transparent">
              Enlace Externo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              URL lista para abrir en una nueva ventana
            </p>
          </div>

          {/* Información del enlace */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-sm border border-blue-100 dark:border-blue-900">
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <ExternalLink
                  className="text-blue-500 dark:text-blue-400"
                  size={24}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {url}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enlace URL
                </p>
              </div>
            </div>
          </div>

          {/* Botón de abrir enlace */}
          <div className="flex justify-center pt-4">
            <GradientButton
              href={url}
              isExternalLink={true}
              startColor="blue"
              endColor="indigo"
              icon={ExternalLink}
              label="Abrir enlace"
            />
          </div>

          {/* Nota informativa */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              El enlace se abrirá en una nueva pestaña del navegador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLViewer;
