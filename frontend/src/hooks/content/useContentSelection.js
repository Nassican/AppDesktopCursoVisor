import { useCallback } from "react";
import { config } from "../../config/environment";
import { lastWatchedService } from "../../services/api/courses/lastWatchedService";

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
      if (type === null) {
        if (progressUpdateTimerRef.current) {
          clearInterval(progressUpdateTimerRef.current);
          progressUpdateTimerRef.current = null;
        }
        setSelectedContent(null);
        return;
      }

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

        lastWatchedService.updateLastWatched(
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
