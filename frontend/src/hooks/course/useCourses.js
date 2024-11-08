import { useState } from "react";
import { useCallback } from "react";
import { courseService } from "../../services/api/courses/courseService";

const useCoursesState = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return {
    courses,
    setCourses,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};

export const useCourses = () => {
  const state = useCoursesState();
  const { setCourses, setIsLoading, setError } = state;

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await courseService.fetchCourses();
      setCourses(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [setCourses, setIsLoading, setError]);

  const updateCourseIcon = useCallback(
    async (courseId, newIcon) => {
      try {
        await courseService.updateCourseIcon(courseId, newIcon);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId ? { ...course, icon: newIcon } : course
          )
        );
        return true;
      } catch (err) {
        setError(err);
        return false;
      }
    },
    [setCourses, setError]
  );

  return {
    ...state,
    fetchCourses,
    updateCourseIcon,
  };
};
