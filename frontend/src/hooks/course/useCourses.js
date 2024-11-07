import { useState, useCallback } from "react";
import { courseService } from "../../services/api/courseService";

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  const updateCourseIcon = useCallback(async (courseId, newIcon) => {
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
  }, []);

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    updateCourseIcon,
  };
};
