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
    { icon: SiReact, name: "React", color: "text-blue-400" },
    { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-teal-500" },
    { icon: SiElectron, name: "Electron", color: "text-blue-600" },
    { icon: SiNodedotjs, name: "Node.js", color: "text-green-600" },
    { icon: SiExpress, name: "Express", color: "text-gray-600" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-modalSlide">
        <div className="flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Acerca de la Aplicación
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Esta aplicación fue diseñada para ayudar a organizar y ver cursos de
            video, PDFs y documentos de manera eficiente. Puedes personalizar
            los iconos de los cursos y realizar un seguimiento de tu progreso.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Tecnologías utilizadas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <tech.icon
                    className={`text-xl ${tech.color} transition-transform group-hover:scale-110`}
                  />
                  <span className="text-sm text-gray-600">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start space-x-2">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                  v{version}
                </span>
                <span className="text-blue-600 font-medium pt-1">
                  Versión estable
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Nassican"
                  className="group flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-base font-medium text-gray-700">
                      Jesus Benavides
                    </span>
                    <span className="text-sm text-gray-500">Desarrollador</span>
                  </div>
                  <SiGithub className="text-xl text-gray-700 group-hover:scale-110 group-hover:text-black transition-all duration-300" />
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
