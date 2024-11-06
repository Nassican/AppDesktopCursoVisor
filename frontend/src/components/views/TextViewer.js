import { useState, useEffect } from "react";

const TextViewer = ({ filePath }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error("Error loading text file:", error));
  }, [filePath]);

  return content;
};

export default TextViewer;
