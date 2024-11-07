import { useState, useCallback } from "react";

export const useNavigation = (
  selectedCourse,
  videoHistory,
  selectedContent,
  updateVideoProgressToBackend,
  lastProgressUpdateRef,
  setSelectedCourse,
  setSelectedContent
) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => {
      if (prev[path]) {
        const newExpandedFolders = { ...prev };
        delete newExpandedFolders[path];
        return newExpandedFolders;
      }
      return {
        ...prev,
        [path]: true,
      };
    });
  };

  // Funciones de useFolderProgress
  const calculateFolderProgress = useCallback(
    (node) => {
      const countFilesInFolder = (node) => {
        return Object.values(node).reduce(
          (acc, value) => {
            if (typeof value === "object" && !value.type) {
              const subFolderCounts = countFilesInFolder(value);
              return {
                total: acc.total + subFolderCounts.total,
                watched: acc.watched + subFolderCounts.watched,
              };
            } else if (
              value.type &&
              ["video", "pdf", "epub", "html"].includes(value.type)
            ) {
              const completePath = `http://localhost:3001/api/file/${encodeURIComponent(
                `${selectedCourse}/${value.path}`
              )}`;
              return {
                total: acc.total + 1,
                watched: acc.watched + (videoHistory[completePath] ? 1 : 0),
              };
            }
            return acc;
          },
          { total: 0, watched: 0 }
        );
      };

      const { total, watched } = countFilesInFolder(node);
      return total > 0 ? (watched / total) * 100 : 0;
    },
    [selectedCourse, videoHistory]
  );

  // Funciones de useHomeNavigation
  const goToHome = useCallback(() => {
    if (selectedContent?.type === "video") {
      const lastProgress = lastProgressUpdateRef.current[selectedContent.path];
      if (lastProgress) {
        updateVideoProgressToBackend(
          selectedContent.path,
          lastProgress
        ).finally(() => {
          setSelectedCourse(null);
          setSelectedContent(null);
        });
      } else {
        setSelectedCourse(null);
        setSelectedContent(null);
      }
    } else {
      setSelectedCourse(null);
      setSelectedContent(null);
    }
  }, [
    selectedContent,
    updateVideoProgressToBackend,
    lastProgressUpdateRef,
    setSelectedCourse,
    setSelectedContent,
  ]);

  return {
    expandedFolders,
    setExpandedFolders,
    toggleFolder,
    calculateFolderProgress,
    goToHome,
  };
};
