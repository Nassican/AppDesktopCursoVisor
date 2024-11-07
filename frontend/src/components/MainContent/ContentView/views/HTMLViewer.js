import { useState, useEffect } from "react";

const themes = {
  light: {
    background: "white",
    text: "#374151",
    // ... más variables de tema
  },
  dark: {
    background: "#1f2937",
    text: "#f9fafb",
    // ... más variables de tema
  },
};

const HTMLViewer = ({ filePath, theme = "light" }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((content) => setHtmlContent(content))
      .catch((error) => console.error("Error loading HTML:", error));
  }, [filePath]);

  const currentTheme = themes[theme];

  const styledHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          :root {
            --background: ${currentTheme.background};
            --text: ${currentTheme.text};
            /* ... más variables CSS */
          }
          .heading {
            align-items: center;
            justify-content: center;
            display: flex;
          }
          html {
            font-family: "Roboto", sans-serif;
          }
          body {
            background: var(--background);
            color: var(--text);
            /* ... */
          }
            h1, h2, h3, h4, h5, h6 {
              color: #1f2937;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            /* Estilos para párrafos y listas */
            p, ul, ol {
              margin-bottom: 1rem;
            }
            /* Estilos para enlaces */
            a {
              color: #3b82f6;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            /* Estilos para código */
            pre, code {
              background: #f3f4f6;
              border-radius: 0.25rem;
              font-family: monospace;
            }
            /* Estilos para tablas */
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1rem;
            }
            th, td {
              border: 1px solid #e5e7eb;
              text-align: left;
            }
            th {
              background: #f9fafb;
            }
            /* Estilos para imágenes */
            img {
              max-width: 100%;
              height: auto;
              border-radius: 0.375rem;
            }
            /* Estilos para bloques de código */
            pre {
              overflow-x: auto;
              background: #1f2937;
              color: #f9fafb;
              border-radius: 0.5rem;
            }
            /* Estilos para citas */
            blockquote {
              border-left: 4px solid #e5e7eb;
              margin: 0;
              padding-left: 1rem;
              color: #6b7280;
            }
            /* Estilos para divisores */
            hr {
              border: 0;
              border-top: 1px solid #e5e7eb;
              margin: 2rem 0;
            }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  return (
    <div className="flex-1 bg-white rounded-lg overflow-hidden">
      <iframe
        title="Contenido HTML"
        srcDoc={styledHTML}
        className="w-full h-full border-0"
        style={{ minHeight: "calc(100vh - 12rem)" }}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default HTMLViewer;
