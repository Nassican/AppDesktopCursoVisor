import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileVideo, Folder, InfoIcon, SearchIcon } from "lucide-react";
import * as SiIcons from "react-icons/si";
import IconSelector from "./IconSelector";

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

  const renderLastWatched = () => {
    if (!lastWatched) return null;

    // Obtener solo el nombre del video sin la ruta completa
    const videoNameDisplay = decodeURIComponent(lastWatched.videoPath)
      .replace(/%5C/g, "/") // Reemplazar %5C por /
      .replace(/\\/g, "/") // Reemplazar \ por /
      .split("/")
      .pop() // Obtener el último elemento (nombre del archivo)
      .replace(/\.[^/.]+$/, ""); // Remover la extensión

    const sectionPath = decodeURIComponent(lastWatched.videoPath)
      .replace(/%5C/g, "/")
      .replace(/\\/g, "/")
      .split("/");
    sectionPath.pop(); // Eliminar el nombre del archivo
    const sectionName = sectionPath.pop(); // Obtener el nombre de la carpeta

    return (
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Continuar viendo</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FileVideo className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{videoNameDisplay}</h3>
              <p className="text-sm text-gray-500">
                {courses.find((c) => c.id === lastWatched.courseId)?.name} /{" "}
                {sectionName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onCourseSelect(
                lastWatched.courseId,
                lastWatched.videoPath,
                lastWatched.expandedFolders
              );
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
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
          <div className="flex flex-col pt-4">{renderLastWatched()}</div>
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
      {isLoadingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin shadow-lg"></div>
                </div>
              </div>
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
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-4">
                Acerca de la Aplicación
              </h2>
              <p className="text-gray-600 mb-4">
                Esta aplicación fue diseñada para ayudar a organizar y ver
                cursos de video, pdfs y documentos de manera eficiente. Puedes
                personalizar los iconos de los cursos y realizar un seguimiento
                de tu progreso.
              </p>
              <p className="text-gray-600 mb-6">Versión 2.0</p>
              <p className="text-gray-600 mb-6">
                Realizado por{" "}
                <a
                  href="https://github.com/Nassican"
                  className="flex items-center text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jesus Benavides
                  <SiIcons.SiGithub className="ml-2" />
                </a>
              </p>
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors self-end"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
