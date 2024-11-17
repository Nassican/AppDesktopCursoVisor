import React from "react";
import {
  SiGithub,
  SiReact,
  SiTailwindcss,
  SiElectron,
  SiExpress,
  SiNodedotjs,
} from "react-icons/si";
import { X } from "lucide-react";

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const version = "2.0.0";

  const technologies = [
    {
      icon: SiReact,
      name: "React",
      color: "text-blue-400 dark:text-blue-400",
    },
    {
      icon: SiTailwindcss,
      name: "Tailwind CSS",
      color: "text-teal-500 dark:text-teal-500",
    },
    {
      icon: SiElectron,
      name: "Electron",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: SiNodedotjs,
      name: "Node.js",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: SiExpress,
      name: "Express",
      color: "text-gray-600 dark:text-gray-300",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4 sm:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-xl transform transition-all animate-modalSlide">
        <div className="flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} className="text-gray-500 dark:text-slate-400" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200 pr-8">
            Acerca de la Aplicación
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
            Esta aplicación fue diseñada para ayudar a organizar y ver cursos de
            video, PDFs y documentos de manera eficiente. Puedes personalizar
            los iconos de los cursos y realizar un seguimiento de tu progreso.
          </p>

          <div className="bg-gray-50 dark:bg-slate-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Tecnologías utilizadas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-gray-200 dark:hover:bg-slate-600 bg-gray-100 dark:bg-slate-800 rounded-lg"
                >
                  <tech.icon
                    className={`text-xl sm:text-2xl ${tech.color} transition-transform group-hover:scale-110`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col  bg-gradient-to-r from-blue-50 dark:from-blue-900 to-blue-100 dark:to-blue-900 p-3 sm:p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex flex-col items-start space-y-1 sm:space-y-2">
                <span className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white text-xs font-medium rounded-full">
                  v{version}
                </span>
                <span className="text-sm sm:text-base text-blue-600 dark:text-blue-300 font-medium">
                  Versión estable
                </span>
              </div>

              <div className="w-full sm:w-auto">
                <a
                  href="https://github.com/Nassican"
                  className="group flex items-center hover:scale-105 gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                      Jesus Benavides
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Desarrollador
                    </span>
                  </div>
                  <SiGithub className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 group-hover:scale-110 group-hover:text-black dark:group-hover:text-white transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
