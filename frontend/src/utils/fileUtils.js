import {
  FileVideo,
  Image,
  FileTextIcon as FilePdf,
  FileText,
  Archive,
  Link,
  File,
} from "lucide-react";

const MAX_FILENAME_LENGTH = 35;

export const getFileName = (path) => {
  if (!path) return "";
  try {
    const decodedPath = decodeURIComponent(path);
    const filePath = decodedPath.split("/api/file/")[1];
    const fileName = filePath.split("/").pop();

    // Decodificar y limpiar el nombre del archivo
    const cleanFileName = decodeURIComponent(fileName)
      .replace(/%20/g, " ")
      .replace(/%5C/g, "/")
      .replace(/%25/g, "%")
      .replace(/\\/g, "/")
      .split("/")
      .pop();

    // Eliminar la extensión del archivo
    return cleanFileName.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error decodificando el nombre del archivo:", error);
    return path;
  }
};

export const getFileType = (filePath) => {
  const extension = filePath.toLowerCase().split(".").pop();

  const fileTypes = {
    // Videos
    mp4: "video",
    webm: "video",
    mkv: "video",

    // Imágenes
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    webp: "image",

    // Documentos
    pdf: "pdf",
    html: "html",
    txt: "text",
    md: "text",
    epub: "epub",

    // Archivos comprimidos
    zip: "zip",
    rar: "zip",
    "7z": "zip",

    // Enlaces
    url: "url",

    // Otros
    default: "unknown",
  };

  return fileTypes[extension] || fileTypes.default;
};

export const truncateFileName = (fileName) => {
  if (fileName.length <= MAX_FILENAME_LENGTH) return fileName;
  const extension = fileName.split(".").pop();
  const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."));
  const truncated = nameWithoutExt.slice(0, MAX_FILENAME_LENGTH - 3) + "...";
  return `${truncated}.${extension}`;
};

export const customSort = (a, b) => {
  const aIsNumber = /^\d+/.test(a);
  const bIsNumber = /^\d+/.test(b);

  if (aIsNumber && bIsNumber) {
    return parseInt(a) - parseInt(b);
  } else if (aIsNumber) {
    return -1;
  } else if (bIsNumber) {
    return 1;
  } else {
    return a.localeCompare(b);
  }
};

export const getSectionName = (selectedContent) => {
  if (!selectedContent) return "";
  const sectionPath = decodeURIComponent(selectedContent.path)
    .replace(/%20/g, " ")
    .replace(/%5C/g, "/")
    .replace(/%25/g, "%")
    .replace(/\\/g, "/")
    .split("/");

  sectionPath.pop(); // Eliminar el nombre del archivo
  const sectionName = sectionPath.pop(); // Obtener el nombre de la carpeta
  return decodeURIComponent(sectionName);
};

export const getFileIcon = (type) => {
  const iconMap = {
    video: <FileVideo size={16} className="text-red-500 dark:text-red-400" />,
    image: <Image size={16} className="text-green-500 dark:text-green-400" />,
    pdf: <FilePdf size={16} className="text-blue-500 dark:text-blue-400" />,
    html: <FileText size={16} className="text-green-500 dark:text-green-400" />,
    text: <FileText size={16} className="text-gray-500 dark:text-gray-400" />,
    epub: (
      <FileText size={16} className="text-purple-500 dark:text-purple-400" />
    ), // Agregar esta línea
    zip: <Archive size={16} className="text-purple-500 dark:text-purple-400" />,
    url: <Link size={16} className="text-blue-400 dark:text-blue-300" />,
    unknown: <File size={16} className="text-gray-400 dark:text-gray-300" />,
  };

  return iconMap[type] || iconMap.unknown;
};
