import { useCallback, useRef } from "react";
import { courseService } from "../services/api/courseService";

export const useVideoProgress = (selectedCourse, setVideoProgress) => {
  const progressUpdateTimerRef = useRef(null);
  const lastProgressUpdateRef = useRef({});

  const updateVideoProgressToBackend = useCallback(
    async (videoPath, progress) => {
      if (selectedCourse) {
        try {
          await courseService.updateVideoProgress(
            selectedCourse,
            videoPath,
            progress
          );
        } catch (error) {
          console.error("Error updating progress to backend:", error);
        }
      }
    },
    [selectedCourse]
  );

  const updateVideoProgressLocally = useCallback(
    (path, newProgress) => {
      setVideoProgress((prev) => ({
        ...prev,
        [path]: newProgress,
      }));
      localStorage.setItem(
        `videoProgress_${path}`,
        JSON.stringify(newProgress)
      );
      lastProgressUpdateRef.current[path] = newProgress;
    },
    [setVideoProgress]
  );

  return {
    progressUpdateTimerRef,
    lastProgressUpdateRef,
    updateVideoProgressToBackend,
    updateVideoProgressLocally,
  };
};
