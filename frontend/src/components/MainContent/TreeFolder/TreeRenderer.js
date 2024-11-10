import React, { useMemo, useCallback } from "react";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import {
  getFileType,
  getFileIcon,
  truncateFileName,
  customSort,
} from "../../../utils/fileUtils";
import { config } from "../../../config/environment";

const TreeRenderer = ({
  node,
  path = "",
  selectedCourse,
  expandedFolders,
  toggleFolder,
  videoProgress,
  videoHistory,
  handleWatchedChange,
  selectContent,
  calculateFolderProgress,
}) => {
  // Memoizar la función de procesamiento de archivos
  const processFile = useCallback(
    (key, value, currentPath) => {
      const type = getFileType(key);
      const icon = getFileIcon(type);
      const completePath = `${selectedCourse}/${value.path}`;
      const filePath = `${config.API_URL}/file/${encodeURIComponent(
        completePath
      )}`;

      const progress = videoProgress[filePath];
      const isWatched = videoHistory[filePath] || false;
      const progressPercentage = isWatched
        ? 100
        : progress
        ? (progress.currentTime / progress.duration) * 100
        : 0;

      return {
        icon,
        filePath,
        isWatched,
        progressPercentage,
        showProgress: ["video", "pdf", "html"].includes(value.type),
        fileName: truncateFileName(key),
      };
    },
    [selectedCourse, videoProgress, videoHistory]
  );

  // Memoizar el árbol completo
  const renderedTree = useMemo(() => {
    const renderNode = (node, currentPath = "") => {
      return Object.entries(node)
        .sort(([a], [b]) => customSort(a, b))
        .map(([key, value]) => {
          const nodePath = currentPath ? `${currentPath}/${key}` : key;
          const isFolder = typeof value === "object" && !value.type;

          if (isFolder) {
            const isExpanded = expandedFolders[nodePath];
            const folderProgress = calculateFolderProgress(value);

            return (
              <FolderItem
                key={nodePath}
                currentPath={nodePath}
                isExpanded={isExpanded}
                toggleFolder={toggleFolder}
                folderName={key}
                folderProgress={folderProgress}
              >
                {isExpanded && renderNode(value, nodePath)}
              </FolderItem>
            );
          }

          const fileProps = processFile(key, value, nodePath);

          return (
            <FileItem
              key={nodePath}
              currentPath={nodePath}
              {...fileProps}
              handleWatchedChange={handleWatchedChange}
              onSelect={selectContent}
              value={value}
            />
          );
        });
    };

    return renderNode(node, path);
  }, [
    node,
    path,
    expandedFolders,
    toggleFolder,
    calculateFolderProgress,
    processFile,
    handleWatchedChange,
    selectContent,
  ]);

  return renderedTree;
};

export default React.memo(TreeRenderer);
