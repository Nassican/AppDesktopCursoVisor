import React, { useState, useEffect, useCallback } from "react";
import { useCourses } from "../../hooks/useCourses";
import { useLastWatched } from "../../hooks/useLastWatched";
import IconSelector from "./courses/IconSelector";
import LastWatched from "./body/LastWatched";
import AboutModal from "../common/AboutModal";
import Header from "./body/HeaderHome";
import SearchBar from "./body/SearchBar";
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
    <div className="p-8 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col">
          <Header onAboutClick={handleAboutClick} />
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
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
