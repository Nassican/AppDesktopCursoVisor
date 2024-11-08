import { useState, useCallback } from "react";
import { lastWatchedService } from "../../services/api/courses/lastWatchedService";

export const useLastWatched = () => {
  const [lastWatched, setLastWatched] = useState(null);

  const fetchLastWatched = useCallback(async () => {
    try {
      const data = await lastWatchedService.fetchLastWatched();
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
