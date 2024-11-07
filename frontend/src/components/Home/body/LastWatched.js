import React from "react";
import { FileVideo } from "lucide-react";

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
            className="
              flex items-center gap-2
              bg-blue-500 hover:bg-blue-600 
              text-white font-medium
              px-6 py-2.5 
              rounded-lg 
              transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              active:scale-95
            "
          >
            <FileVideo size={18} />
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LastWatched;
