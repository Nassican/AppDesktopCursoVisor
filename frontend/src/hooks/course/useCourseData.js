import { useState, useEffect } from "react";
import { courseService } from "../../services/api/courses/courseService";
import { courseProgressService } from "../../services/api/courses/courseProgressService";
import { courseStructureService } from "../../services/api/courses/courseStructureService";

const useCourseDataState = () => {
  const [structure, setStructure] = useState(null);
  const [videoHistory, setVideoHistory] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return {
    structure,
    setStructure,
    videoHistory,
    setVideoHistory,
    videoProgress,
    setVideoProgress,
    courseInfo,
    setCourseInfo,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};

const useCourseDataFetch = (selectedCourse, state) => {
  const {
    setStructure,
    setVideoHistory,
    setVideoProgress,
    setCourseInfo,
    setIsLoading,
    setError,
  } = state;

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
          courseStructureService.fetchVideoHistory(selectedCourse),
          courseService.fetchCourseInfo(selectedCourse),
          courseProgressService.fetchVideoProgress(selectedCourse),
          courseStructureService.fetchFolderStructure(selectedCourse),
        ]);

        setVideoHistory(history);
        setCourseInfo(info);
        setVideoProgress(progress);
        setStructure(folderStructure);
      } catch (error) {
        setError(error);
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    selectedCourse,
    setStructure,
    setVideoHistory,
    setVideoProgress,
    setCourseInfo,
    setIsLoading,
    setError,
  ]);
};

export const useCourseData = (selectedCourse) => {
  const state = useCourseDataState();
  useCourseDataFetch(selectedCourse, state);

  return state;
};
