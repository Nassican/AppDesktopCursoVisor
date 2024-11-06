import { useState, useCallback } from "react";
import axios from "axios";

export const useLastWatched = () => {
  const [lastWatched, setLastWatched] = useState(null);

  const fetchLastWatched = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/last-watched"
      );
      if (response.data) {
        setLastWatched(response.data);
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
