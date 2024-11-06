import React from "react";
import { SiGithub } from "react-icons/si";

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Acerca de la Aplicación</h2>
          <p className="text-gray-600 mb-4">
            Esta aplicación fue diseñada para ayudar a organizar y ver cursos de
            video, pdfs y documentos de manera eficiente. Puedes personalizar
            los iconos de los cursos y realizar un seguimiento de tu progreso.
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
              <SiGithub className="ml-2" />
            </a>
          </p>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors self-end"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
