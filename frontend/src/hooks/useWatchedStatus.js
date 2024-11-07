import { useCallback } from "react";
import { fileHistoryService } from "../services/api/fileHistoryService";

export const useWatchedStatus = (
  selectedCourse,
  videoProgress,
  setVideoHistory,
  setCourseInfo,
  updateVideoProgressLocally
) => {
  const handleWatchedChange = useCallback(
    async (path, isWatched) => {
      if (selectedCourse) {
        const updatedHistory = await fileHistoryService.updateHistory(
          selectedCourse,
          path,
          isWatched
        );

        if (updatedHistory) {
          setVideoHistory(updatedHistory);
          setCourseInfo((prevInfo) => ({
            ...prevInfo,
            filesWatched: isWatched
              ? prevInfo.filesWatched + 1
              : prevInfo.filesWatched - 1,
          }));
        }

        const currentProgress = videoProgress[path] || {
          currentTime: 0,
          duration: 1,
        };
        updateVideoProgressLocally(path, currentProgress);
      }
    },
    [
      selectedCourse,
      updateVideoProgressLocally,
      videoProgress,
      setCourseInfo,
      setVideoHistory,
    ]
  );

  return handleWatchedChange;
};
