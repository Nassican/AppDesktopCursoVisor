import React, { useState, useEffect } from "react";
import axios from "axios";
import { Folder } from "lucide-react";
import * as SiIcons from "react-icons/si";
import IconSelector from "./IconSelector";

const Home = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

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

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cursos disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
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
      {isLoadingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-6 text-center text-lg font-semibold text-gray-700">
                Cargando selector de iconos...
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                Esto solo tomará un momento
              </p>
            </div>
          </div>
        </div>
      )}
      {isIconSelectorOpen && (
        <IconSelector
          onClose={() => setIsIconSelectorOpen(false)}
          onSelectIcon={handleIconChange}
        />
      )}
    </div>
  );
};

export default Home;
