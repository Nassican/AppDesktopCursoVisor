import { useState, useEffect} from "react";
import axios from "axios";
import { Folder } from "lucide-react";
import * as SiIcons from "react-icons/si";
import IconSelector from "./IconSelector";

const Home = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

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

  const handleAddNewCourse = async () => {
    try {
      if (!window.electron || typeof window.electron.openFolder !== 'function') {
        throw new Error('La función openFolder no está disponible');
      }
      const folderPath = await window.electron.openFolder();
      if (folderPath) {
        const response = await axios.post("http://localhost:3001/api/add-course-folder", { folderPath });
        if (response.data.success) {
          alert("Nuevo curso agregado correctamente");
          fetchCourses(); // Actualiza la lista de cursos
        }
      }
    } catch (error) {
      console.error("Error al agregar el nuevo curso:", error);
      alert("Error al agregar el nuevo curso: " + error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cursos disponibles</h1>
        <button
          onClick={handleAddNewCourse}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Seleccionar carpeta de cursos
        </button>
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
                <div className="flex flex-1 items-center justify-between">
                  <div
                    className="flex items-center"
                    onClick={() => onCourseSelect(course.id)}
                  >
                    <IconComponent
                      className="text-blue-500 mr-4 min-w-10 min-h-10"
                      size={24}
                    />
                    <div>
                      <h2 className="text-xl font-medium mb-2">
                        {course.name}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsIconSelectorOpen(true);
                    }}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    Cambiar icono
                  </button>
                </div>
                <div className="mt-auto pt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (course.videosWatched / course.totalVideos) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.videosWatched} / {course.totalVideos} videos vistos
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
