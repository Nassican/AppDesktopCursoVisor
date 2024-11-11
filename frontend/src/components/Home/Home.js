import React, { useState, useEffect, useCallback } from "react";
import { useCourses } from "../../hooks/course/useCourses";
import { useLastWatched } from "../../hooks/content/useLastWatched";
import IconSelector from "./courses/IconSelector";
import LastWatched from "./body/LastWatched";
import AboutModal from "../common/AboutModal";
import Header from "./body/HeaderHome";
import CourseGrid from "./body/CourseGrid";

const Home = React.memo(({ onCourseSelect }) => {
  const { courses, isLoading, fetchCourses, error, updateCourseIcon } =
    useCourses();
  const { lastWatched, fetchLastWatched } = useLastWatched();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Efecto inicial memoizado
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCourses(), fetchLastWatched()]);
    };
    fetchData();
  }, [fetchCourses, fetchLastWatched]); // Removemos las dependencias ya que las funciones son estables

  // Funciones de manejo memoizadas
  const handleIconClick = useCallback((course) => {
    setSelectedCourse(course);
    setIsIconSelectorOpen(true);
  }, []);

  const handleIconChange = useCallback(
    async (newIcon) => {
      if (
        selectedCourse &&
        (await updateCourseIcon(selectedCourse.id, newIcon))
      ) {
        setIsIconSelectorOpen(false);
      }
    },
    [selectedCourse, updateCourseIcon]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }, []);

  const handleAboutClick = useCallback(() => {
    setIsAboutModalOpen(true);
  }, []);

  const handleAboutClose = useCallback(() => {
    setIsAboutModalOpen(false);
  }, []);

  const handleIconSelectorClose = useCallback(() => {
    setIsIconSelectorOpen(false);
  }, []);

  // Memoización de cursos filtrados
  const filteredCourses = React.useMemo(
    () =>
      courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm)
      ),
    [courses, searchTerm]
  );

  // Props memoizadas para componentes hijos
  const headerProps = React.useMemo(
    () => ({
      onAboutClick: handleAboutClick,
      searchValue: searchTerm,
      onSearchChange: handleSearchChange,
    }),
    [handleAboutClick, searchTerm, handleSearchChange]
  );

  const lastWatchedProps = React.useMemo(
    () => ({
      lastWatched,
      courses,
      onCourseSelect,
    }),
    [lastWatched, courses, onCourseSelect]
  );

  const courseGridProps = React.useMemo(
    () => ({
      courses: filteredCourses,
      onIconClick: handleIconClick,
      onCourseSelect,
      isLoading,
      error,
    }),
    [filteredCourses, handleIconClick, onCourseSelect, isLoading, error]
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header {...headerProps} />
      <main
        className="flex-1 px-8 pb-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto 
        sm:[&::-webkit-scrollbar]:w-[14px] [&::-webkit-scrollbar]:w-0
        sm:[&::-webkit-scrollbar-track]:bg-transparent 
        sm:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700
        sm:[&::-webkit-scrollbar-thumb]:rounded-full 
        sm:[&::-webkit-scrollbar-thumb]:border-[4px] 
        sm:[&::-webkit-scrollbar-thumb]:border-solid 
        sm:[&::-webkit-scrollbar-thumb]:border-transparent 
        sm:[&::-webkit-scrollbar-thumb]:bg-clip-padding 
        hover:sm:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:sm:[&::-webkit-scrollbar-thumb]:bg-slate-600
        active:sm:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:active:sm:[&::-webkit-scrollbar-thumb]:bg-slate-500"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col">
            {courses.length > 0 && <LastWatched {...lastWatchedProps} />}
          </div>
          <CourseGrid {...courseGridProps} />
        </div>
      </main>
      <IconSelector
        isOpen={isIconSelectorOpen}
        onClose={handleIconSelectorClose}
        onSelectIcon={handleIconChange}
      />
      <AboutModal isOpen={isAboutModalOpen} onClose={handleAboutClose} />
    </div>
  );
});

Home.displayName = "Home";

export default Home;
