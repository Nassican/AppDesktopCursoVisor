import { useState, useEffect } from "react";

const TextViewer = ({ filePath }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error("Error loading text file:", error));
  }, [filePath]);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-inner p-4 overflow-auto">
      <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    </div>
  );
};

export default TextViewer;
