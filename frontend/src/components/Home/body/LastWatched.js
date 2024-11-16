import React from "react";
import { FileVideo } from "lucide-react";
import GradientButton from "../../common/GradientButton";

const LastWatched = ({ lastWatched, courses, onCourseSelect }) => {
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
    <div className="flex flex-col pt-4">
      <div className=" bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            Continuar viendo
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start w-full sm:w-auto group">
            <div className="bg-gradient-to-br from-blue-100 dark:from-blue-600 to-blue-50 dark:to-blue-900 p-3.5 rounded-xl mr-4 shrink-0 shadow-sm group-hover:shadow transition-all duration-300">
              <FileVideo
                className="text-blue-500 dark:text-blue-200 group-hover:scale-110 transition-transform duration-300"
                size={24}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-medium text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 ">
                {videoNameDisplay}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                <span>
                  {courses.find((c) => c.id === lastWatched.courseId)?.name}
                </span>
                <span className="shrink-0 text-gray-400 dark:text-gray-500">
                  /
                </span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {sectionName}
                </span>
              </div>
            </div>
          </div>
          <GradientButton
            onClick={() => {
              onCourseSelect(
                lastWatched.courseId,
                lastWatched.videoPath,
                lastWatched.expandedFolders
              );
            }}
            size="sm"
            startColor="blue"
            endColor="indigo"
            icon={FileVideo}
            label="Continuar"
          />
        </div>
      </div>
    </div>
  );
};

export default LastWatched;
