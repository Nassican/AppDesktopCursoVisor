import React, { useState } from "react";
import Sidebar from "./ContentView/Sidebar/Sidebar";
import CourseHeader from "./ContentView/Header/CourseHeader";
import MainView from "./ContentView/Body/MainView";
import TreeRenderer from "./TreeFolder/TreeRenderer";

const CourseView = ({
  structure,
  selectedCourse,
  expandedFolders,
  toggleFolder,
  videoProgress,
  videoHistory,
  handleWatchedChange,
  selectContent,
  calculateFolderProgress,
  goToHome,
  courseInfo,
  selectedContent,
  getSectionName,
  getFileName,
  handleVideoTimeUpdate,
  handleVideoPause,
  handleVideoPlay,
  handleVideoEnded,
  isLoading,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-grow overflow-hidden">
      <Sidebar
        structure={structure}
        renderTree={() => (
          <TreeRenderer
            node={structure}
            selectedCourse={selectedCourse}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            videoProgress={videoProgress}
            videoHistory={videoHistory}
            handleWatchedChange={handleWatchedChange}
            selectContent={selectContent}
            calculateFolderProgress={calculateFolderProgress}
          />
        )}
        goToHome={goToHome}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className="w-full p-4 flex flex-col h-[calc(100vh)]">
        <CourseHeader
          courseInfo={courseInfo}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          onHomeClick={() => selectContent(null)}
        />
        <MainView
          selectedContent={selectedContent}
          courseInfo={courseInfo}
          getSectionName={getSectionName}
          getFileName={getFileName}
          handleVideoTimeUpdate={handleVideoTimeUpdate}
          handleVideoPause={handleVideoPause}
          handleVideoPlay={handleVideoPlay}
          handleVideoEnded={handleVideoEnded}
          videoProgress={videoProgress}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CourseView;
