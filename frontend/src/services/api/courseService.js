import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

export const courseService = {
  async fetchCourses() {
    try {
      const response = await axios.get(`${BASE_URL}/courses`);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  async fetchLastWatched() {
    try {
      const response = await axios.get(`${BASE_URL}/last-watched`);
      return response.data;
    } catch (error) {
      console.error("Error fetching last watched:", error);
      throw error;
    }
  },

  async updateCourseIcon(courseId, newIcon) {
    try {
      await axios.post(`${BASE_URL}/courses/${courseId}/icon`, {
        icon: newIcon,
      });
      return true;
    } catch (error) {
      console.error("Error updating course icon:", error);
      throw error;
    }
  },
};
