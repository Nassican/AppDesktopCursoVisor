import axios from "axios";

const VIDEO_HISTORY_KEY = "videoHistory";

export const videoHistoryService = {
  async fetchHistory(courseId) {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/video-history/${courseId}`
      );
      const history = response.data.videos || {};
      localStorage.setItem(
        `${VIDEO_HISTORY_KEY}_${courseId}`,
        JSON.stringify(history)
      );
      return history;
    } catch (error) {
      console.error("Error fetching video history:", error);
      return {};
    }
  },

  async updateHistory(courseId, videoPath, isWatched) {
    try {
      const history =
        JSON.parse(localStorage.getItem(`${VIDEO_HISTORY_KEY}_${courseId}`)) ||
        {};
      history[videoPath] = isWatched;
      localStorage.setItem(
        `${VIDEO_HISTORY_KEY}_${courseId}`,
        JSON.stringify(history)
      );

      await axios.post(`http://localhost:3001/api/video-history/${courseId}`, {
        videoPath,
        isWatched,
      });

      return history;
    } catch (error) {
      console.error("Error updating video history:", error);
      return null;
    }
  },

  getLocalHistory(courseId) {
    return (
      JSON.parse(localStorage.getItem(`${VIDEO_HISTORY_KEY}_${courseId}`)) || {}
    );
  },

  isVideoWatched(courseId, videoPath) {
    const history = this.getLocalHistory(courseId);
    return !!history[videoPath];
  },
};
