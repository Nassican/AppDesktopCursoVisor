import { useState, useCallback } from "react";
import { courseService } from "../../services/api/courseService";

export const useLastWatched = () => {
  const [lastWatched, setLastWatched] = useState(null);

  const fetchLastWatched = useCallback(async () => {
    try {
      const data = await courseService.fetchLastWatched();
      if (data) {
        setLastWatched(data);
      }
    } catch (error) {
      console.error("Error fetching last watched:", error);
    }
  }, []);

  return {
    lastWatched,
    fetchLastWatched,
  };
};
