import React from "react";

const VideoViewer = ({
  filePath,
  onTimeUpdate,
  onPause,
  onPlay,
  onEnded,
  videoProgress,
}) => {
  return (
    <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
      <video
        src={filePath}
        controls
        className="h-full w-full object-contain"
        onTimeUpdate={onTimeUpdate}
        onPause={onPause}
        onPlay={onPlay}
        onEnded={onEnded}
        key={filePath}
        onLoadedMetadata={(e) => {
          const video = e.target;
          const savedProgress = videoProgress[filePath];
          if (
            savedProgress &&
            savedProgress.currentTime &&
            isFinite(savedProgress.currentTime)
          ) {
            video.currentTime = savedProgress.currentTime;
          }
        }}
      />
    </div>
  );
};

export default VideoViewer;
