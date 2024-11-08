import axiosInstance from "../../config/axiosConfig";

export const lastWatchedService = {
  async fetchLastWatched() {
    const { data } = await axiosInstance.get("/last-watched");
    return data;
  },

  async updateLastWatched(courseId, videoPath, videoName, expandedFolders) {
    await axiosInstance.post("/last-watched", {
      courseId,
      videoPath,
      videoName,
      expandedFolders,
    });
  },
};
