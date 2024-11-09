import { useState, useEffect } from "react";
import { FileText, Copy, Check } from "lucide-react";
import Loader from "../../../common/Loader";

const TextViewer = ({ filePath }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error("Error loading text file:", error))
      .finally(() => setIsLoading(false));
  }, [filePath]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br">
        <Loader size="medium" color="blue" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              Archivo de Texto
            </h2>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600 text-sm font-medium"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-2 overflow-auto max-h-[calc(100vh-12rem)]">
          <pre
            className="
              whitespace-pre-wrap 
              font-mono 
              text-sm 
              text-gray-700 
              bg-gray-50/50 
              p-4 
              rounded-xl 
              border 
              border-gray-100
              leading-relaxed
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-200
              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
