import { useCallback } from "react";

export const useHomeNavigation = (
  selectedContent,
  updateVideoProgressToBackend,
  lastProgressUpdateRef,
  setSelectedCourse,
  setSelectedContent
) => {
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

  return goToHome;
};
