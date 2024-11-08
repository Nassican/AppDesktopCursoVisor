import axiosInstance from "../../config/axiosConfig";

export const courseProgressService = {
  async fetchVideoProgress(courseId) {
    const { data } = await axiosInstance.get(`/progress/${courseId}`);
    return data;
  },

  async updateVideoProgress(courseId, videoPath, progress) {
    const { data } = await axiosInstance.post(`/progress/${courseId}`, {
      path: videoPath,
      progress,
    });
    return data;
  },
};
