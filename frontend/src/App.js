import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Folder,
  ChevronRight,
  ChevronDown,
  FileVideo,
  FileText,
  File,
  FileTextIcon as FilePdf,
  Home as HomeIcon,
  Image,
  Archive,
  Link,
  Download,
} from "lucide-react";
import axios from "axios";
import { fileHistoryService } from "./services/api/fileHistoryService";
import Home from "./components/Home/Home";
import * as SiIcons from "react-icons/si";
import URLViewer from "./components/views/URLViewer";
import TextViewer from "./components/views/TextViewer";
import HTMLViewer from "./components/views/HTMLViewer";
import EPUBViewer from "./components/views/EPUBViewer";
import VideoViewer from "./components/views/VideoViewer";
import ImageViewer from "./components/views/ImageViewer";

import {
  getFileName,
  getFileType,
  truncateFileName,
  customSort,
  getSectionName,
} from "./utils/fileUtils";

const PROGRESS_UPDATE_INTERVAL = 10000; // 10 seconds

const App = () => {
  const [structure, setStructure] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [, setFolderPath] = useState("");
  const [videoProgress, setVideoProgress] = useState({});
  const [videoHistory, setVideoHistory] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const progressUpdateTimerRef = useRef(null);
  const lastProgressUpdateRef = useRef({});
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    if (selectedCourse) {
      fetchFolderStructure();
      fetchVideoProgress();
      fetchVideoHistory();
      fetchCourseInfo();
    }
    return () => {
      if (progressUpdateTimerRef.current) {
        clearInterval(progressUpdateTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const fetchVideoHistory = async () => {
    if (selectedCourse) {
      const history = await fileHistoryService.fetchHistory(selectedCourse);
      setVideoHistory(history);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/courses/${selectedCourse}`
      );
      setCourseInfo(response.data);
    } catch (error) {
      console.error("Error fetching course info:", error);
    }
  };

  const fetchVideoProgress = async () => {
    if (selectedCourse) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/progress/${selectedCourse}`
        );
        setVideoProgress(response.data);
      } catch (error) {
        console.error("Error fetching video progress:", error);
      }
    }
  };

  const fetchFolderStructure = async () => {
    try {
      if (!selectedCourse) return null;

      const response = await axios.post(
        "http://localhost:3001/api/folder-structure",
        {
          folderPath: `/${selectedCourse}`,
          courseId: selectedCourse,
        }
      );
      setStructure(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching folder structure:", error);
      return null;
    }
  };

  const toggleFolder = (path) => {
    console.log("Toggling folder:", path);

    setExpandedFolders((prev) => {
      // Si el folder ya está abierto, lo cerramos
      if (prev[path]) {
        const newExpandedFolders = { ...prev };
        delete newExpandedFolders[path];
        return newExpandedFolders;
      }
      // Si está cerrado, lo abrimos manteniendo los demás estados
      return {
        ...prev,
        [path]: true,
      };
    });
  };

  const updateVideoProgressToBackend = useCallback(
    async (videoPath, progress) => {
      if (selectedCourse) {
        console.log(
          "Attempting to update progress to backend:",
          videoPath,
          progress
        );
        try {
          await axios.post(
            `http://localhost:3001/api/progress/${selectedCourse}`,
            {
              path: videoPath,
              progress,
            }
          );
          console.log("Progress successfully updated to backend");
        } catch (error) {
          console.error("Error updating progress to backend:", error);
        }
      }
    },
    [selectedCourse]
  );

  const selectContent = useCallback(
    (type, filePath) => {
      if (!selectedCourse || !filePath) return;

      // Asegurarnos de que la ruta del video esté correctamente formada
      const normalizedPath = filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;
      const completePath = `${selectedCourse}/${normalizedPath}`;

      setSelectedContent({
        type,
        path: `http://localhost:3001/api/file/${encodeURIComponent(
          completePath
        )}`,
      });

      if (progressUpdateTimerRef.current) {
        clearInterval(progressUpdateTimerRef.current);
      }

      if (type === "video") {
        const videoName = normalizedPath
          .split("/")
          .pop()
          .replace(/\.[^/.]+$/, "");

        axios.post("http://localhost:3001/api/last-watched", {
          courseId: selectedCourse,
          videoPath: normalizedPath,
          videoName: videoName,
          expandedFolders: expandedFolders,
        });

        progressUpdateTimerRef.current = setInterval(() => {
          const lastProgress = lastProgressUpdateRef.current[completePath];
          if (lastProgress) {
            updateVideoProgressToBackend(completePath, lastProgress);
          }
        }, PROGRESS_UPDATE_INTERVAL);
      }
    },
    [selectedCourse, updateVideoProgressToBackend, expandedFolders]
  );

  const updateVideoProgressLocally = useCallback((path, newProgress) => {
    //console.log("Updating video progress locally:", path, newProgress);
    setVideoProgress((prev) => ({
      ...prev,
      [path]: newProgress,
    }));
    localStorage.setItem(`videoProgress_${path}`, JSON.stringify(newProgress));
    lastProgressUpdateRef.current[path] = newProgress;
  }, []);

  const handleWatchedChange = useCallback(
    async (path, isWatched) => {
      if (selectedCourse) {
        const updatedHistory = await fileHistoryService.updateHistory(
          selectedCourse,
          path,
          isWatched
        );
        if (updatedHistory) {
          setVideoHistory(updatedHistory);
          setCourseInfo((prevInfo) => ({
            ...prevInfo,
            filesWatched: isWatched
              ? prevInfo.filesWatched + 1
              : prevInfo.filesWatched - 1,
          }));
        }

        // No modificamos el progreso del video, solo mantenemos el estado actual
        const currentProgress = videoProgress[path] || {
          currentTime: 0,
          duration: 1,
        };
        updateVideoProgressLocally(path, currentProgress);
      }
    },
    [selectedCourse, updateVideoProgressLocally, videoProgress]
  );

  const handleVideoTimeUpdate = useCallback(
    (e) => {
      const video = e.target;
      const newProgress = {
        currentTime: video.currentTime,
        duration: video.duration,
      };
      updateVideoProgressLocally(selectedContent.path, newProgress);

      if (video.currentTime === video.duration) {
        handleWatchedChange(selectedContent.path, true);
      }
    },
    [selectedContent, handleWatchedChange, updateVideoProgressLocally]
  );

  const handleVideoPause = useCallback(() => {
    setIsVideoPaused(true);
    const lastProgress = lastProgressUpdateRef.current[selectedContent.path];
    if (lastProgress) {
      updateVideoProgressToBackend(selectedContent.path, lastProgress);
    }
  }, [selectedContent, updateVideoProgressToBackend]);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPaused(false);
  }, []);

  useEffect(() => {
    let syncInterval;

    if (selectedContent && selectedContent.type === "video" && !isVideoPaused) {
      syncInterval = setInterval(() => {
        const lastProgress =
          lastProgressUpdateRef.current[selectedContent.path];
        if (lastProgress) {
          updateVideoProgressToBackend(selectedContent.path, lastProgress);
        }
      }, PROGRESS_UPDATE_INTERVAL);
    }

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [selectedContent, updateVideoProgressToBackend, isVideoPaused]);

  const handleCourseSelect = (courseId, initialVideoPath = null) => {
    if (!courseId) return;

    setSelectedCourse(courseId);
    const folderPath = `/${courseId}`;
    setFolderPath(folderPath);
    setStructure(null);

    if (initialVideoPath) {
      // Primero cargamos la estructura
      fetchFolderStructure().then(() => {
        // Solo expandimos el folder padre del video
        const decodedPath = decodeURIComponent(initialVideoPath)
          .replace(/%5C/g, "/") // Reemplazar \\ por /
          .replace(/\\/g, "/"); // Reemplazar \ por /

        // Obtener las partes de la ruta
        const pathParts = decodedPath.split("/");
        //console.log("Decoded pathParts:", pathParts);
        if (pathParts.length > 1) {
          const parentFolder = pathParts.slice(0, -1).join("/");
          //console.log("parentFolder", parentFolder);
          setExpandedFolders({ [parentFolder]: true });
        }

        // Seleccionamos el contenido directamente
        setSelectedContent({
          type: "video",
          path: `http://localhost:3001/api/file/${encodeURIComponent(
            `${courseId}/${initialVideoPath}`
          )}`,
        });
      });
    } else {
      setExpandedFolders({});
      setSelectedContent(null);
      fetchFolderStructure();
    }
  };

  const goToHome = () => {
    // Si hay un video seleccionado, guardamos su progreso
    if (selectedContent?.type === "video") {
      const lastProgress = lastProgressUpdateRef.current[selectedContent.path];
      if (lastProgress) {
        updateVideoProgressToBackend(selectedContent.path, lastProgress)
          .then(() => {
            // Limpiar estados después de guardar el progreso
            setSelectedCourse(null);
            setStructure(null);
            setSelectedContent(null);
            setFolderPath("");
          })
          .catch((error) => {
            console.error(
              "Error saving video progress before going home:",
              error
            );
            // Limpiar estados incluso si hay error
            setSelectedCourse(null);
            setStructure(null);
            setSelectedContent(null);
            setFolderPath("");
          });
      } else {
        // Si no hay progreso que guardar, solo limpiamos los estados
        setSelectedCourse(null);
        setStructure(null);
        setSelectedContent(null);
        setFolderPath("");
      }
    } else {
      // Si no hay video seleccionado, simplemente limpiamos los estados
      setSelectedCourse(null);
      setStructure(null);
      setSelectedContent(null);
      setFolderPath("");
    }
  };

  // 1. Modificar calculateFolderProgress para incluir HTML
  const calculateFolderProgress = useCallback(
    (node) => {
      let totalFiles = 0;
      let watchedFiles = 0;

      const countFiles = (node) => {
        Object.entries(node).forEach(([, value]) => {
          if (typeof value === "object" && !value.type) {
            countFiles(value);
          } else if (
            value.type &&
            ["video", "pdf", "epub", "html"].includes(value.type)
          ) {
            totalFiles++;
            const completePath = `http://localhost:3001/api/file/${encodeURIComponent(
              `${selectedCourse}/${value.path}`
            )}`;
            if (videoHistory[completePath]) {
              watchedFiles++;
            }
          }
        });
      };

      countFiles(node);
      return totalFiles > 0 ? (watchedFiles / totalFiles) * 100 : 0;
    },
    [selectedCourse, videoHistory]
  );

  const renderTree = (node, path = "") => {
    return Object.entries(node)
      .sort(([a], [b]) => customSort(a, b))
      .map(([key, value]) => {
        const currentPath = path ? `${path}/${key}` : key;
        const isFolder = typeof value === "object" && !value.type;

        if (isFolder) {
          const isExpanded = expandedFolders[currentPath];
          const folderProgress = calculateFolderProgress(value);

          return (
            <div key={currentPath}>
              <div className="w-full ">
                <div
                  className={`cursor-pointer p-2 hover:bg-gray-100 w-full ${
                    isExpanded ? "bg-gray-200" : ""
                  }`}
                  onClick={() => toggleFolder(currentPath)}
                >
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 w-6">
                      {isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                    <Folder
                      size={16}
                      className="flex-shrink-0 mr-2 text-blue-500"
                    />
                    <span className="flex-grow mr-4" title={key}>
                      {key}
                    </span>
                  </div>
                  <div className="ml-6 mr-4 flex items-center gap-2">
                    <div className="flex-grow bg-gray-400 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${folderProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex-shrink-0 min-w-[40px] text-xs text-gray-500 text-right">
                      {Math.round(folderProgress)}%
                    </div>
                  </div>
                </div>
              </div>
              {isExpanded && <div>{renderTree(value, currentPath)}</div>}
            </div>
          );
        } else {
          // Obtener el tipo e icono usando las funciones existentes
          const type = getFileType(key);
          const icon = getFileIcon(type);

          const completePath = `${selectedCourse}/${value.path}`;
          const filePath = `http://localhost:3001/api/file/${encodeURIComponent(
            completePath
          )}`;
          const progress = videoProgress[filePath];
          const isWatched = videoHistory[filePath] || false;
          const progressPercentage = isWatched
            ? 100
            : progress
            ? (progress.currentTime / progress.duration) * 100
            : 0;
          const showProgress = ["video", "pdf", "html"].includes(value.type);

          return (
            <div key={currentPath} className="flex flex-col w-full">
              <div className="hover:bg-gray-100 w-full">
                <div
                  className="cursor-pointer p-2 pl-8 pr-2"
                  onClick={() => {
                    selectContent(value.type, value.path);
                  }}
                >
                  <div className="flex items-center mb-2">
                    {React.cloneElement(icon, {
                      size: 16,
                      className: `mr-2 ${icon.props.className}`,
                    })}
                    {showProgress ? (
                      <input
                        type="checkbox"
                        checked={isWatched}
                        onChange={(e) =>
                          handleWatchedChange(filePath, e.target.checked)
                        }
                        className="ml-2 mr-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="ml-4"></div>
                    )}
                    <span className="truncate" title={key}>
                      {truncateFileName(key)}
                    </span>
                  </div>
                  {showProgress && (
                    <div className="ml-6 mr-4 bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          isWatched ? "bg-green-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
      });
  };

  const getFileIcon = (type) => {
    const iconMap = {
      video: <FileVideo size={16} className="text-red-500" />,
      image: <Image size={16} className="text-green-500" />,
      pdf: <FilePdf size={16} className="text-blue-500" />,
      html: <FileText size={16} className="text-green-500" />,
      text: <FileText size={16} className="text-gray-500" />,
      epub: <FileText size={16} className="text-purple-500" />, // Agregar esta línea
      zip: <Archive size={16} className="text-purple-500" />,
      url: <Link size={16} className="text-blue-400" />,
      unknown: <File size={16} className="text-gray-400" />,
    };

    return iconMap[type] || iconMap.unknown;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {!selectedCourse ? (
        <Home onCourseSelect={handleCourseSelect} />
      ) : (
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/4 bg-white border-r shadow-md flex flex-col">
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xl font-bold text-gray-800">CursoVisor</h2>
                <button
                  onClick={goToHome}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <HomeIcon size={24} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-grow pb-10 p-0 custom-scrollbar">
              {structure ? (
                renderTree(structure)
              ) : (
                <p>Cargando estructura de carpetas...</p>
              )}
            </div>
          </div>

          <div className="w-full p-4 flex flex-col h-[calc(100vh)]">
            {courseInfo && (
              <div className="flex-shrink-0 mb-4 flex items-center">
                {courseInfo.icon && SiIcons[courseInfo.icon] ? (
                  SiIcons[courseInfo.icon]({
                    size: 24,
                    className: "text-gray-500 mr-4",
                  })
                ) : (
                  <Folder size={24} className="text-gray-500 mr-4" />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-500">
                    {courseInfo.name}
                  </h3>
                </div>
              </div>
            )}
            {selectedContent ? (
              <div className="flex flex-col flex-1 min-h-0">
                <h2 className="text-lg font-semibold mb-4 text-gray-500">
                  {getSectionName(selectedContent)} /{" "}
                  {getFileName(selectedContent.path)}
                </h2>

                {(() => {
                  switch (selectedContent.type) {
                    case "video":
                      return (
                        <VideoViewer
                          filePath={selectedContent.path}
                          onTimeUpdate={handleVideoTimeUpdate}
                          onPause={handleVideoPause}
                          onPlay={handleVideoPlay}
                          videoProgress={videoProgress}
                        />
                      );

                    case "image":
                      return (
                        <ImageViewer
                          filePath={selectedContent.path}
                          fileName={getFileName(selectedContent.path)}
                        />
                      );

                    case "text":
                      return (
                        <div className="flex-1 bg-white rounded-lg shadow-inner p-4 overflow-auto">
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            <TextViewer filePath={selectedContent.path} />
                          </pre>
                        </div>
                      );

                    case "url":
                      return (
                        <div className="flex-1 flex items-center justify-center">
                          <URLViewer filePath={selectedContent.path} />
                        </div>
                      );

                    case "html":
                      return (
                        <div className="flex-1 bg-white rounded-lg overflow-hidden">
                          <HTMLViewer filePath={selectedContent.path} />
                        </div>
                      );

                    case "pdf":
                      return (
                        <div className="flex-1 bg-white rounded-lg overflow-hidden flex flex-col">
                          <object
                            data={selectedContent.path}
                            type="application/pdf"
                            className="w-full h-full"
                          >
                            <div className="flex-1 flex items-center justify-center p-8">
                              <div className="text-center">
                                <FilePdf
                                  size={64}
                                  className="mx-auto mb-4 text-blue-500"
                                />
                                <h3 className="text-lg font-medium mb-2">
                                  No se puede mostrar el PDF
                                </h3>
                                <p className="text-gray-600 mb-4">
                                  Tu navegador no puede mostrar PDFs integrados.
                                </p>
                                <a
                                  href={selectedContent.path}
                                  download
                                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 
                       text-white rounded-lg transition-colors"
                                >
                                  <Download size={16} className="mr-2" />
                                  Descargar PDF
                                </a>
                              </div>
                            </div>
                          </object>
                        </div>
                      );

                    case "epub":
                      return (
                        <div className="flex-1 bg-white rounded-lg overflow-hidden flex flex-col">
                          <EPUBViewer filePath={selectedContent.path} />
                        </div>
                      );

                    case "zip":
                      return (
                        <div className="flex-1 flex items-center justify-center p-8">
                          <div className="text-center">
                            <Archive
                              size={64}
                              className="mx-auto mb-4 text-purple-500"
                            />
                            <h3 className="text-lg font-medium mb-2">
                              Archivo Comprimido
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Este archivo debe ser descargado para su
                              visualización
                            </p>
                            <a
                              href={selectedContent.path}
                              download
                              className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 
                           text-white rounded-lg transition-colors"
                            >
                              <Download size={16} className="mr-2" />
                              Descargar
                            </a>
                          </div>
                        </div>
                      );

                    default:
                      return (
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-gray-500">
                            No se puede previsualizar este tipo de archivo
                          </p>
                        </div>
                      );
                  }
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  {courseInfo && (
                    <div className="mb-8 flex flex-col items-center">
                      {courseInfo.icon && SiIcons[courseInfo.icon] ? (
                        SiIcons[courseInfo.icon]({
                          size: 256,
                          className: "text-blue-500 mb-4",
                        })
                      ) : (
                        <Folder size={256} className="text-blue-500 mb-4" />
                      )}
                      <h3 className="text-2xl font-bold mb-2">
                        {courseInfo.name}
                      </h3>
                      <p className="text-lg text-gray-600 mb-4">
                        Selecciona un archivo para visualizarlo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
