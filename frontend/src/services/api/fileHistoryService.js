import axios from "axios";

const FILE_HISTORY_KEY = "fileHistory";

export const fileHistoryService = {
  async fetchHistory(courseId) {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/file-history/${courseId}`
      );
      const history = response.data.files || {};
      localStorage.setItem(
        `${FILE_HISTORY_KEY}_${courseId}`,
        JSON.stringify(history)
      );
      return history;
    } catch (error) {
      console.error("Error fetching file history:", error);
      return {};
    }
  },

  async updateHistory(courseId, filePath, isWatched) {
    try {
      const history =
        JSON.parse(localStorage.getItem(`${FILE_HISTORY_KEY}_${courseId}`)) ||
        {};
      history[filePath] = isWatched;
      localStorage.setItem(
        `${FILE_HISTORY_KEY}_${courseId}`,
        JSON.stringify(history)
      );

      await axios.post(`http://localhost:3001/api/file-history/${courseId}`, {
        filePath,
        isWatched,
      });

      return history;
    } catch (error) {
      console.error("Error updating file history:", error);
      return null;
    }
  },

  getLocalHistory(courseId) {
    return (
      JSON.parse(localStorage.getItem(`${FILE_HISTORY_KEY}_${courseId}`)) || {}
    );
  },

  isFileWatched(courseId, filePath) {
    const history = this.getLocalHistory(courseId);
    return !!history[filePath];
  },
};
