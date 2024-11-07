import React, { useState } from "react";

const ImageViewer = ({ filePath, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500">
          <p>Error al cargar la imagen</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <img
        src={filePath}
        alt={fileName || "Imagen"}
        className="max-h-full max-w-full object-contain"
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          setError("No se pudo cargar la imagen");
          console.error("Error loading image:", e);
        }}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  );
};

export default ImageViewer;
