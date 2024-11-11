import { Download, RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Loader from "../../../common/Loader";

const ImageViewer = ({ filePath, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [filePath]);

  const handleDownload = async () => {
    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "imagen";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
    }
  };

  return (
    <div className="relative flex-1 bg-blue-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <Loader color="white" size="medium" />
        </div>
      )}

      <TransformWrapper
        key={filePath}
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit={true}
        limitToBounds={true}
        wheel={{
          step: 0.05, // Paso más pequeño para zoom más suave
          smoothStep: 0.005,
          disabled: false,
        }}
        pinch={{ disabled: false }}
        doubleClick={{ disabled: true }}
        panning={{ disabled: false }}
        velocityAnimation={{
          sensitivity: 1,
          animationTime: 200,
          equalToMove: true,
        }}
        alignmentAnimation={{
          disabled: true,
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 right-4 flex gap-2 z-50">
              <button
                onClick={() => zoomIn(0.2)}
                className="bg-gray-800/50 hover:bg-gray-800/70 dark:bg-gray-700/50 dark:hover:bg-gray-500/70 text-white p-2 rounded-lg"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
              <button
                onClick={() => zoomOut(0.2)}
                className="bg-gray-800/50 hover:bg-gray-800/70 dark:bg-gray-700/50 dark:hover:bg-gray-500/70 text-white p-2 rounded-lg"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="bg-gray-800/50 hover:bg-gray-800/70 dark:bg-gray-700/50 dark:hover:bg-gray-500/70 text-white p-2 rounded-lg"
              >
                <RefreshCcw className="w-6 h-6" />
              </button>
              <button
                onClick={handleDownload}
                className="bg-gray-800/50 hover:bg-gray-800/70 dark:bg-gray-700/50 dark:hover:bg-gray-500/70 text-white p-2 rounded-lg"
                title="Descargar imagen"
              >
                <Download className="w-6 h-6" />
              </button>
            </div>

            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              <img
                src={filePath}
                alt={fileName || "Imagen"}
                className="h-full w-full object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError("Error al cargar la imagen");
                }}
                key={filePath}
                draggable={false}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
