import React, { useState, useEffect, useCallback } from "react";
import { useCourses } from "../../hooks/course/useCourses";
import { useLastWatched } from "../../hooks/content/useLastWatched";
import IconSelector from "./courses/IconSelector";
import LastWatched from "./body/LastWatched";
import AboutModal from "../common/AboutModal";
import Header from "./body/HeaderHome";
import CourseGrid from "./body/CourseGrid";

const Home = ({ onCourseSelect }) => {
  const { courses, isLoading, fetchCourses, updateCourseIcon } = useCourses();
  const { lastWatched, fetchLastWatched } = useLastWatched();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([fetchCourses(), fetchLastWatched()]);
  }, [fetchCourses, fetchLastWatched]);

  const handleIconClick = useCallback((course) => {
    setSelectedCourse(course);
    setIsIconSelectorOpen(true);
  }, []);

  const handleIconChange = useCallback(
    async (newIcon) => {
      if (await updateCourseIcon(selectedCourse.id, newIcon)) {
        setIsIconSelectorOpen(false);
      }
    },
    [selectedCourse, updateCourseIcon]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleAboutClick = useCallback(() => {
    setIsAboutModalOpen(true);
  }, []);

  const handleAboutClose = useCallback(() => {
    setIsAboutModalOpen(false);
  }, []);

  const filteredCourses = React.useMemo(
    () =>
      courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [courses, searchTerm]
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <Header
        onAboutClick={handleAboutClick}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <main
        className="
        flex-1 
        px-8 
        pb-8 
        bg-gray-100 
        overflow-y-auto 
        sm:[&::-webkit-scrollbar]:w-[14px] 
        [&::-webkit-scrollbar]:w-0
        sm:[&::-webkit-scrollbar-track]:bg-transparent 
        sm:[&::-webkit-scrollbar-thumb]:bg-gray-300 
        sm:[&::-webkit-scrollbar-thumb]:rounded-full 
        sm:[&::-webkit-scrollbar-thumb]:border-[4px] 
        sm:[&::-webkit-scrollbar-thumb]:border-solid 
        sm:[&::-webkit-scrollbar-thumb]:border-transparent 
        sm:[&::-webkit-scrollbar-thumb]:bg-clip-padding 
        hover:sm:[&::-webkit-scrollbar-thumb]:bg-gray-400 
        active:sm:[&::-webkit-scrollbar-thumb]:bg-gray-500"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col">
            <LastWatched
              lastWatched={lastWatched}
              courses={courses}
              onCourseSelect={onCourseSelect}
            />
          </div>
          <CourseGrid
            courses={filteredCourses}
            onIconClick={handleIconClick}
            onCourseSelect={onCourseSelect}
            isLoading={isLoading}
          />
        </div>
      </main>
      <IconSelector
        isOpen={isIconSelectorOpen}
        onClose={() => setIsIconSelectorOpen(false)}
        onSelectIcon={handleIconChange}
      />
      <AboutModal isOpen={isAboutModalOpen} onClose={handleAboutClose} />
    </div>
  );
};

export default React.memo(Home);
