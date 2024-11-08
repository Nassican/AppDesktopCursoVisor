import { fileHistoryService } from "./fileHistoryService";
import axiosInstance from "./axiosConfig";

export const courseService = {
  async fetchCourses() {
    const { data } = await axiosInstance.get("/courses");
    return data;
  },

  async fetchLastWatched() {
    const { data } = await axiosInstance.get("/last-watched");
    return data;
  },

  async updateCourseIcon(courseId, newIcon) {
    await axiosInstance.post(`/courses/${courseId}/icon`, { icon: newIcon });
    return true;
  },

  async fetchVideoHistory(courseId) {
    return await fileHistoryService.fetchHistory(courseId);
  },

  async fetchCourseInfo(courseId) {
    const { data } = await axiosInstance.get(`/courses/${courseId}`);
    return data;
  },

  async fetchVideoProgress(courseId) {
    const { data } = await axiosInstance.get(`/progress/${courseId}`);
    return data;
  },

  async fetchFolderStructure(courseId) {
    const { data } = await axiosInstance.post("/folder-structure", {
      folderPath: `/${courseId}`,
      courseId,
    });
    return data;
  },

  async updateVideoProgress(courseId, videoPath, progress) {
    const { data } = await axiosInstance.post(`/progress/${courseId}`, {
      path: videoPath,
      progress,
    });
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
