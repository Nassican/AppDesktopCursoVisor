import { useState, useEffect } from "react";
import { courseService } from "../../services/api/courseService";

export const useCourseData = (selectedCourse) => {
  const [structure, setStructure] = useState(null);
  const [videoHistory, setVideoHistory] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCourse) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [history, info, progress, folderStructure] = await Promise.all([
          courseService.fetchVideoHistory(selectedCourse),
          courseService.fetchCourseInfo(selectedCourse),
          courseService.fetchVideoProgress(selectedCourse),
          courseService.fetchFolderStructure(selectedCourse),
        ]);

        setVideoHistory(history);
        setCourseInfo(info);
        setVideoProgress(progress);
        setStructure(folderStructure);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        console.error("Error fetching course data:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse]);

  return {
    structure,
    videoHistory,
    videoProgress,
    courseInfo,
    isLoading,
    error,
    setVideoHistory,
    setVideoProgress,
    setCourseInfo,
    setStructure,
  };
};
