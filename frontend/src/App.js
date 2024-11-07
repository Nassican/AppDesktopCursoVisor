import React, { useState } from "react";
import Home from "./components/Home/Home";
import { getFileName, getSectionName } from "./utils/fileUtils";
import { useFolder } from "./hooks/useFolder";
import { useFolderProgress } from "./hooks/useFolderProgress";
import { useCourseData } from "./hooks/useCourseData";
import CourseView from "./components/MainContent/ContentView/CourseView";
import { useVideoProgress } from "./hooks/useVideoProgress";
import { useWatchedStatus } from "./hooks/useWatchedStatus";
import { useContentSelection } from "./hooks/useContentSelection";
import { useVideoHandlers } from "./hooks/useVideoHandlers";
import { useCourseSelection } from "./hooks/useCourseSelection";
import { useHomeNavigation } from "./hooks/useHomeNavigation";

const App = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [, setIsVideoPaused] = useState(true);

  // Custom hooks
  const { expandedFolders, setExpandedFolders, toggleFolder } = useFolder();
  const {
    structure,
    videoHistory,
    videoProgress,
    courseInfo,
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

  const calculateFolderProgress = useFolderProgress(
    selectedCourse,
    videoHistory
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

  const goToHome = useHomeNavigation(
    selectedContent,
    updateVideoProgressToBackend,
    lastProgressUpdateRef,
    setSelectedCourse,
    setSelectedContent
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {!selectedCourse ? (
        <Home onCourseSelect={handleCourseSelect} />
      ) : (
        <CourseView
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
