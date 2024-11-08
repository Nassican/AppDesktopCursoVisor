import { useCallback } from "react";
import { courseService } from "../../services/api/courseService";
import { config } from "../../config/environment";

const PROGRESS_UPDATE_INTERVAL = 10000;

export const useContentSelection = (
  selectedCourse,
  setSelectedContent,
  expandedFolders,
  progressUpdateTimerRef,
  lastProgressUpdateRef,
  updateVideoProgressToBackend
) => {
  const selectContent = useCallback(
    (type, filePath) => {
      if (!selectedCourse || !filePath) return;

      const normalizedPath = filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;
      const completePath = `${selectedCourse}/${normalizedPath}`;

      setSelectedContent({
        type,
        path: `${config.API_URL}/file/${encodeURIComponent(completePath)}`,
      });

      if (progressUpdateTimerRef.current) {
        clearInterval(progressUpdateTimerRef.current);
      }

      if (type === "video") {
        const videoName = normalizedPath
          .split("/")
          .pop()
          .replace(/\.[^/.]+$/, "");

        courseService.updateLastWatched(
          selectedCourse,
          normalizedPath,
          videoName,
          expandedFolders
        );

        progressUpdateTimerRef.current = setInterval(() => {
          const lastProgress = lastProgressUpdateRef.current[completePath];
          if (lastProgress) {
            updateVideoProgressToBackend(completePath, lastProgress);
          }
        }, PROGRESS_UPDATE_INTERVAL);
      }
    },
    [
      selectedCourse,
      updateVideoProgressToBackend,
      expandedFolders,
      progressUpdateTimerRef,
      lastProgressUpdateRef,
      setSelectedContent,
    ]
  );

  return selectContent;
};
