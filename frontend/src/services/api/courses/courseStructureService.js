import axiosInstance from "../../config/axiosConfig";
import { fileHistoryService } from "../fileHistory/fileHistoryService";

export const courseStructureService = {
  async fetchFolderStructure(courseId) {
    const { data } = await axiosInstance.post("/folder-structure", {
      folderPath: `/${courseId}`,
      courseId,
    });
    return data;
  },

  async fetchVideoHistory(courseId) {
    return await fileHistoryService.fetchHistory(courseId);
  },
};
