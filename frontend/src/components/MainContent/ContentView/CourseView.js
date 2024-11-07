import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import CourseHeader from "./Header/CourseHeader";
import MainView from "./Body/MainView";
import TreeRenderer from "../TreeFolder/TreeRenderer";

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
}) => {
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
      />
      <div className="w-full p-4 flex flex-col h-[calc(100vh)]">
        <CourseHeader courseInfo={courseInfo} />
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
        />
      </div>
    </div>
  );
};

export default CourseView;
