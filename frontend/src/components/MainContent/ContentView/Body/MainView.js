import React from "react";
import VideoViewer from "../views/VideoViewer";
import ImageViewer from "../views/ImageViewer";
import TextViewer from "../views/TextViewer";
import URLViewer from "../views/URLViewer";
import HTMLViewer from "../views/HTMLViewer";
import PDFViewer from "../views/PDFViewer";
import EPUBViewer from "../views/EPUBViewer";
import ZIPViewer from "../views/ZIPViewer";
import EmptyStateView from "./EmptyStateView";

const MainView = ({
  selectedContent,
  courseInfo,
  getSectionName,
  getFileName,
  handleVideoTimeUpdate,
  handleVideoPause,
  handleVideoPlay,
  handleVideoEnded,
  videoProgress,
  isLoading,
}) => {
  if (!selectedContent) {
    return <EmptyStateView courseInfo={courseInfo} isLoading={isLoading} />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <h2 className="text-lg font-semibold mb-4 text-gray-500">
        {getSectionName(selectedContent)} / {getFileName(selectedContent.path)}
      </h2>

      {(() => {
        switch (selectedContent.type) {
          case "video":
            return (
              <VideoViewer
                filePath={selectedContent.path}
                onTimeUpdate={handleVideoTimeUpdate}
                onPause={handleVideoPause}
                onPlay={handleVideoPlay}
                onEnded={handleVideoEnded}
                videoProgress={videoProgress}
              />
            );
          case "image":
            return (
              <ImageViewer
                filePath={selectedContent.path}
                fileName={getFileName(selectedContent.path)}
              />
            );
          case "text":
            return <TextViewer filePath={selectedContent.path} />;
          case "url":
            return <URLViewer filePath={selectedContent.path} />;
          case "html":
            return <HTMLViewer filePath={selectedContent.path} />;
          case "pdf":
            return <PDFViewer filePath={selectedContent.path} />;
          case "epub":
            return <EPUBViewer filePath={selectedContent.path} />;
          case "zip":
            return <ZIPViewer filePath={selectedContent.path} />;
          default:
            return (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">
                  No se puede previsualizar este tipo de archivo
                </p>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default MainView;
