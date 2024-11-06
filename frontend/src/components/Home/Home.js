import React, { useState, useEffect } from "react";
import { useCourses } from "../../hooks/useCourses";
import axios from "axios";
import IconSelector from "./IconSelector";
import LastWatched from "./LastWatched";
import AboutModal from "../common/AboutModal";
import Header from "./HeaderHome";
import SearchBar from "./SearchBar";
import CourseGrid from "./CourseGrid";

const Home = ({ onCourseSelect }) => {
  const { courses, isLoading, fetchCourses, updateCourseIcon } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastWatched, setLastWatched] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchLastWatched();
  }, [fetchCourses]);

  const fetchLastWatched = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/last-watched"
      );
      if (response.data) {
        console.log("Received last watched data:", response.data);
        setLastWatched(response.data);
      }
    } catch (error) {
      console.error("Error fetching last watched:", error);
    }
  };

  const handleIconClick = (course) => {
    setSelectedCourse(course);
    setIsIconSelectorOpen(true);
  };

  const handleIconChange = async (newIcon) => {
    if (await updateCourseIcon(selectedCourse.id, newIcon)) {
      setIsIconSelectorOpen(false);
    }
  };

  // Filtrar cursos basado en el término de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col">
          <Header onAboutClick={() => setIsAboutModalOpen(true)} />
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default Home;
