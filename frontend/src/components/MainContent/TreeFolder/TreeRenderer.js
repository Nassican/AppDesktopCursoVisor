import React from "react";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import {
  getFileType,
  getFileIcon,
  truncateFileName,
} from "../../../utils/fileUtils";
import { customSort } from "../../../utils/fileUtils";

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
  return Object.entries(node)
    .sort(([a], [b]) => customSort(a, b))
    .map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isFolder = typeof value === "object" && !value.type;

      if (isFolder) {
        const isExpanded = expandedFolders[currentPath];
        const folderProgress = calculateFolderProgress(value);

        return (
          <FolderItem
            key={currentPath}
            currentPath={currentPath}
            isExpanded={isExpanded}
            toggleFolder={toggleFolder}
            folderName={key}
            folderProgress={folderProgress}
          >
            <TreeRenderer
              node={value}
              path={currentPath}
              selectedCourse={selectedCourse}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              videoProgress={videoProgress}
              videoHistory={videoHistory}
              handleWatchedChange={handleWatchedChange}
              selectContent={selectContent}
              calculateFolderProgress={calculateFolderProgress}
            />
          </FolderItem>
        );
      } else {
        const type = getFileType(key);
        const icon = getFileIcon(type);

        const completePath = `${selectedCourse}/${value.path}`;
        const filePath = `http://localhost:3001/api/file/${encodeURIComponent(
          completePath
        )}`;
        const progress = videoProgress[filePath];
        const isWatched = videoHistory[filePath] || false;
        const progressPercentage = isWatched
          ? 100
          : progress
          ? (progress.currentTime / progress.duration) * 100
          : 0;
        const showProgress = ["video", "pdf", "html"].includes(value.type);

        return (
          <FileItem
            key={currentPath}
            currentPath={currentPath}
            icon={icon}
            showProgress={showProgress}
            isWatched={isWatched}
            filePath={filePath}
            handleWatchedChange={handleWatchedChange}
            fileName={truncateFileName(key)}
            progressPercentage={progressPercentage}
            onSelect={selectContent}
            value={value}
          />
        );
      }
    });
};

export default TreeRenderer;
