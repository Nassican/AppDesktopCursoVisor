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
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-y-scroll pr-[calc(100vw-100%)] [&::-webkit-scrollbar]:w-[14px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[4px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 active:[&::-webkit-scrollbar-thumb]:bg-gray-500">
      <Header
        onAboutClick={handleAboutClick}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <main className="flex-1 px-8 pb-8 bg-gray-100 pt-24">
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
