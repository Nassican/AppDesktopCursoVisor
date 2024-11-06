import React, { useState, useEffect } from "react";
import axios from "axios";
import { Folder, InfoIcon, SearchIcon } from "lucide-react";
import * as SiIcons from "react-icons/si";
import IconSelector from "./IconSelector";
import LastWatched from "./LastWatched";
import LoadingModal from "../common/LoadingModal";
import AboutModal from "../common/AboutModal";

const Home = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastWatched, setLastWatched] = useState(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchLastWatched();
  }, []);

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

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleIconChange = async (newIcon) => {
    try {
      await axios.post(
        `http://localhost:3001/api/courses/${selectedCourse.id}/icon`,
        { icon: newIcon }
      );
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id
            ? { ...course, icon: newIcon }
            : course
        )
      );
      setIsIconSelectorOpen(false);
    } catch (error) {
      console.error("Error updating course icon:", error);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Cursos disponibles</h1>
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="bg-blue-100 p-2 rounded-full"
            >
              <InfoIcon className="text-blue-500" size={24} />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-col pt-4">
            <LastWatched
              lastWatched={lastWatched}
              courses={courses}
              onCourseSelect={onCourseSelect}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const IconComponent =
              course.icon && SiIcons[course.icon]
                ? SiIcons[course.icon]
                : Folder;
            return (
              <div
                key={course.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              >
                <div className="flex flex-1 items-center justify-start">
                  <button
                    onClick={() => {
                      setIsLoadingModalOpen(true);
                      setTimeout(() => {
                        setIsLoadingModalOpen(false);
                        setSelectedCourse(course);
                        setIsIconSelectorOpen(true);
                      }, 100);
                    }}
                    className="hover:bg-gray-200 rounded-lg p-2 group relative"
                    aria-label="Cambiar icono del curso"
                  >
                    <IconComponent
                      className="text-blue-500 min-w-10 min-h-10"
                      size={24}
                    />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Cambiar icono
                    </span>
                  </button>
                  <div
                    className="flex items-center ml-4 cursor-pointer"
                    onClick={() => onCourseSelect(course.id)}
                  >
                    <div>
                      <h2 className="text-xl font-medium mb-2">
                        {course.name}
                      </h2>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-auto pt-4 cursor-pointer"
                  onClick={() => onCourseSelect(course.id)}
                >
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (course.filesWatched / course.totalFiles) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.filesWatched} / {course.totalFiles} archivos vistos
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <LoadingModal
        isOpen={isLoadingModalOpen}
        message="Cargando selector de iconos..."
        subMessage="Esto solo tomará un momento"
      />
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
