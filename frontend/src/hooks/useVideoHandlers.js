import { useCallback } from "react";

export const useVideoHandlers = ({
  selectedContent,
  handleWatchedChange,
  updateVideoProgressLocally,
  updateVideoProgressToBackend,
  lastProgressUpdateRef,
  setIsVideoPaused,
}) => {
  const handleVideoTimeUpdate = useCallback(
    (e) => {
      const video = e.target;
      if (video.paused) return;

      const currentTime = Math.floor(video.currentTime);
      const lastTime =
        lastProgressUpdateRef.current[selectedContent?.path]?.currentTime;

      if (lastTime === undefined || Math.abs(currentTime - lastTime) >= 1) {
        const newProgress = {
          currentTime: video.currentTime,
          duration: video.duration,
        };
        updateVideoProgressLocally(selectedContent.path, newProgress);

        if (video.currentTime >= video.duration) {
          handleWatchedChange(selectedContent.path, true);
        }
      }
    },
    [
      selectedContent,
      handleWatchedChange,
      updateVideoProgressLocally,
      lastProgressUpdateRef,
    ]
  );

  const handleVideoEnded = useCallback(() => {
    if (selectedContent) {
      handleWatchedChange(selectedContent.path, true);
    }
  }, [selectedContent, handleWatchedChange]);

  const handleVideoPause = useCallback(() => {
    setIsVideoPaused(true);
    if (selectedContent) {
      const lastProgress = lastProgressUpdateRef.current[selectedContent.path];
      if (lastProgress) {
        updateVideoProgressToBackend(selectedContent.path, lastProgress);
      }
    }
  }, [
    selectedContent,
    updateVideoProgressToBackend,
    lastProgressUpdateRef,
    setIsVideoPaused,
  ]);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPaused(false);
  }, [setIsVideoPaused]);

  return {
    handleVideoTimeUpdate,
    handleVideoEnded,
    handleVideoPause,
    handleVideoPlay,
  };
};
