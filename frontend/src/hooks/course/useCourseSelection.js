import { useCallback } from "react";
import { config } from "../../config/environment";

export const useCourseSelection = (
  setSelectedCourse,
  setExpandedFolders,
  setSelectedContent
) => {
  const handleCourseSelect = useCallback(
    (courseId, initialVideoPath = null) => {
      if (!courseId) return;

      setSelectedCourse(courseId);

      if (initialVideoPath) {
        const decodedPath = decodeURIComponent(initialVideoPath)
          .replace(/%5C/g, "/")
          .replace(/\\/g, "/");

        const pathParts = decodedPath.split("/");
        if (pathParts.length > 1) {
          const parentFolder = pathParts.slice(0, -1).join("/");
          setExpandedFolders({ [parentFolder]: true });
        }

        setSelectedContent({
          type: "video",
          path: `${config.API_URL}/file/${encodeURIComponent(
            `${courseId}/${initialVideoPath}`
          )}`,
        });
      } else {
        setExpandedFolders({});
        setSelectedContent(null);
      }
    },
    [setSelectedCourse, setExpandedFolders, setSelectedContent]
  );

  return handleCourseSelect;
};
