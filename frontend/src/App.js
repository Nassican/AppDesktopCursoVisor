import React, { useState } from "react";
import Home from "./components/Home/Home";
import { getFileName, getSectionName } from "./utils/fileUtils";
import { useCourseData } from "./hooks/course/useCourseData";
import CourseView from "./components/MainContent/CourseView";
import { useVideoProgress } from "./hooks/video/useVideoProgress";
import { useWatchedStatus } from "./hooks/video/useWatchedStatus";
import { useContentSelection } from "./hooks/content/useContentSelection";
import { useVideoHandlers } from "./hooks/video/useVideoHandlers";
import { useCourseSelection } from "./hooks/course/useCourseSelection";
import { useNavigation } from "./hooks/navigation/useNavigation";

const App = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [, setIsVideoPaused] = useState(true);

  const {
    structure,
    videoHistory,
    videoProgress,
    courseInfo,
    isLoading,
    setVideoHistory,
    setVideoProgress,
    setCourseInfo,
  } = useCourseData(selectedCourse);

  const {
    progressUpdateTimerRef,
    lastProgressUpdateRef,
    updateVideoProgressToBackend,
    updateVideoProgressLocally,
  } = useVideoProgress(selectedCourse, setVideoProgress);

  const {
    expandedFolders,
    setExpandedFolders,
    toggleFolder,
    calculateFolderProgress,
    goToHome,
  } = useNavigation(
    selectedCourse,
    videoHistory,
    selectedContent,
    updateVideoProgressToBackend,
    lastProgressUpdateRef,
    setSelectedCourse,
    setSelectedContent
  );

  const selectContent = useContentSelection(
    selectedCourse,
    setSelectedContent,
    expandedFolders,
    progressUpdateTimerRef,
    lastProgressUpdateRef,
    updateVideoProgressToBackend
  );

  const handleWatchedChange = useWatchedStatus(
    selectedCourse,
    videoProgress,
    setVideoHistory,
    setCourseInfo,
    updateVideoProgressLocally
  );

  const {
    handleVideoTimeUpdate,
    handleVideoEnded,
    handleVideoPause,
    handleVideoPlay,
  } = useVideoHandlers({
    selectedContent,
    handleWatchedChange,
    updateVideoProgressLocally,
    updateVideoProgressToBackend,
    lastProgressUpdateRef,
    setIsVideoPaused,
  });

  const handleCourseSelect = useCourseSelection(
    setSelectedCourse,
    setExpandedFolders,
    setSelectedContent
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {!selectedCourse ? (
        <Home onCourseSelect={handleCourseSelect} />
      ) : (
        <CourseView
          isLoading={isLoading}
          structure={structure}
          selectedCourse={selectedCourse}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          videoProgress={videoProgress}
          videoHistory={videoHistory}
          handleWatchedChange={handleWatchedChange}
          selectContent={selectContent}
          calculateFolderProgress={calculateFolderProgress}
          goToHome={goToHome}
          courseInfo={courseInfo}
          selectedContent={selectedContent}
          getSectionName={getSectionName}
          getFileName={getFileName}
          handleVideoTimeUpdate={handleVideoTimeUpdate}
          handleVideoPause={handleVideoPause}
          handleVideoPlay={handleVideoPlay}
          handleVideoEnded={handleVideoEnded}
        />
      )}
    </div>
  );
};

export default App;
