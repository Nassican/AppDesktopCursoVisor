import axiosInstance from "../../config/axiosConfig";

export const courseService = {
  async fetchCourses() {
    const { data } = await axiosInstance.get("/courses");
    return data;
  },

  async updateCourseIcon(courseId, newIcon) {
    await axiosInstance.post(`/courses/${courseId}/icon`, { icon: newIcon });
    return true;
  },

  async fetchCourseInfo(courseId) {
    const { data } = await axiosInstance.get(`/courses/${courseId}`);
    return data;
  },
};
