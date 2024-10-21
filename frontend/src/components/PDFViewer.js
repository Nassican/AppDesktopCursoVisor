import React, { useEffect, useRef } from "react";

const PDFViewer = ({ pdfUrl, onProgressChange }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const savedPage = localStorage.getItem(`pdfProgress_${pdfUrl}`);
    if (savedPage && iframeRef.current) {
      iframeRef.current.src = `${pdfUrl}#page=${savedPage}`;
    }
  }, [pdfUrl]);

  const handlePageChange = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.contentWindow.postMessage({ type: "getPageNumber" }, "*");
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "pageNumber") {
        const currentPage = event.data.pageNumber;
        localStorage.setItem(`pdfProgress_${pdfUrl}`, currentPage);
        onProgressChange(currentPage, event.data.totalPages);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [pdfUrl, onProgressChange]);

  return (
    <div className="w-full h-full">
      <iframe
        title="Contenido PDF"
        ref={iframeRef}
        src={pdfUrl}
        className="w-full h-full rounded-lg shadow-2xl"
        onLoad={handlePageChange}
      />
    </div>
  );
};

export default PDFViewer;
