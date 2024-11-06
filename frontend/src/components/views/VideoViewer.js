import React, { useEffect, useRef } from "react";

const VideoViewer = ({
  filePath,
  onTimeUpdate,
  onPause,
  onPlay,
  videoProgress,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoProgress && videoProgress[filePath]) {
      const progress = videoProgress[filePath];
      if (progress.currentTime && isFinite(progress.currentTime)) {
        video.currentTime = progress.currentTime;
      }
    }
  }, [filePath, videoProgress]);

  return (
    <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={filePath}
        controls
        className="h-full w-full object-contain"
        onTimeUpdate={onTimeUpdate}
        onPause={onPause}
        onPlay={onPlay}
        key={filePath}
      />
    </div>
  );
};

export default VideoViewer;
