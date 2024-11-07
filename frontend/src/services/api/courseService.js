import axios from "axios";
import { fileHistoryService } from "./fileHistoryService";

const API_URL = "http://localhost:3001/api";

export const courseService = {
  async fetchCourses() {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  async fetchLastWatched() {
    try {
      const response = await axios.get(`${API_URL}/last-watched`);
      return response.data;
    } catch (error) {
      console.error("Error fetching last watched:", error);
      throw error;
    }
  },

  async updateCourseIcon(courseId, newIcon) {
    try {
      await axios.post(`${API_URL}/courses/${courseId}/icon`, {
        icon: newIcon,
      });
      return true;
    } catch (error) {
      console.error("Error updating course icon:", error);
      throw error;
    }
  },

  async fetchVideoHistory(courseId) {
    return await fileHistoryService.fetchHistory(courseId);
  },

  async fetchCourseInfo(courseId) {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course info:", error);
      throw error;
    }
  },

  async fetchVideoProgress(courseId) {
    try {
      const response = await axios.get(`${API_URL}/progress/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching video progress:", error);
      throw error;
    }
  },

  async fetchFolderStructure(courseId) {
    try {
      const response = await axios.post(`${API_URL}/folder-structure`, {
        folderPath: `/${courseId}`,
        courseId: courseId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching folder structure:", error);
      throw error;
    }
  },

  async updateVideoProgress(courseId, videoPath, progress) {
    try {
      const response = await axios.post(`${API_URL}/progress/${courseId}`, {
        path: videoPath,
        progress,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating video progress:", error);
      throw error;
    }
  },

  async updateLastWatched(courseId, videoPath, videoName, expandedFolders) {
    try {
      await axios.post(`${API_URL}/last-watched`, {
        courseId,
        videoPath,
        videoName,
        expandedFolders,
      });
    } catch (error) {
      console.error("Error updating last watched:", error);
      throw error;
    }
  },
};
