import { useCallback } from "react";

export const useFolderProgress = (selectedCourse, videoHistory) => {
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

  return calculateFolderProgress;
};
