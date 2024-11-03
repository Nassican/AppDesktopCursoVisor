import { ExternalLink, Link } from "lucide-react";
import { useEffect, useState } from "react";

const URLViewer = ({ filePath }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((content) => {
        // Extraer la URL del archivo .url
        const match = content.match(/URL=(.+)/);
        if (match) setUrl(match[1]);
      })
      .catch((error) => console.error("Error loading URL file:", error));
  }, [filePath]);

  return (
    <div className="text-center">
      <Link size={48} className="mx-auto mb-4 text-blue-500" />
      <h3 className="text-lg font-medium mb-2">Enlace Externo</h3>
      <p className="text-gray-600 mb-4">{url}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 
                 text-white rounded-lg transition-colors"
      >
        <ExternalLink size={16} className="mr-2" />
        Abrir enlace
      </a>
    </div>
  );
};

export default URLViewer;
