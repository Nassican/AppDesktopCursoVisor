import { useState, useEffect, useRef, useCallback } from "react";
import {
  Folder,
  ChevronRight,
  ChevronDown,
  FileVideo,
  FileText,
  File,
  Home as HomeIcon,
} from "lucide-react";
import axios from "axios";
import { videoHistoryService } from "./components/videoHistoryService";
import Home from "./components/Home";
import * as SiIcons from "react-icons/si";

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

  const progressUpdateQueue = useRef({});
  const isUpdatingProgress = useRef(false);

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
      const history = await videoHistoryService.fetchHistory(selectedCourse);
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
      const response = await axios.post(
        "http://localhost:3001/api/folder-structure",
        { courseId: selectedCourse }
      );
      setStructure(response.data);
    } catch (error) {
      console.error("Error fetching folder structure:", error);
    }
  };

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
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
      const completePath = `${courseInfo.localPath}/${filePath}`;
      console.log("completePath:", completePath);
      setSelectedContent({
        type,
        path: `http://localhost:3001/api/file?path=${encodeURIComponent(
          completePath
        )}`,
        fullPath: completePath,
      });

      if (progressUpdateTimerRef.current) {
        clearInterval(progressUpdateTimerRef.current);
      }

      if (type === "video") {
        console.log("Setting up progress update timer for:", completePath);
        progressUpdateTimerRef.current = setInterval(() => {
          const lastProgress = lastProgressUpdateRef.current[completePath];
          console.log("Timer fired. Last progress:", lastProgress);
          if (lastProgress) {
            updateVideoProgressToBackend(completePath, lastProgress);
          }
        }, PROGRESS_UPDATE_INTERVAL);
      }
    },
    [courseInfo, updateVideoProgressToBackend]
  );

  const handleWatchedChange = useCallback(
    async (path, isWatched) => {
      if (selectedCourse) {
        const updatedHistory = await videoHistoryService.updateHistory(
          selectedCourse,
          path,
          isWatched
        );
        if (updatedHistory) {
          setVideoHistory(updatedHistory);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCourse, videoHistoryService]
  );

  const updateVideoProgressLocally = useCallback((path, newProgress) => {
    console.log("Updating video progress locally:", path, newProgress);
    setVideoProgress((prev) => ({
      ...prev,
      [path]: newProgress,
    }));
    localStorage.setItem(`videoProgress_${path}`, JSON.stringify(newProgress));
    lastProgressUpdateRef.current[path] = newProgress;

    // Añadir la actualización a la cola
    progressUpdateQueue.current[path] = newProgress;
  }, []);

  const sendProgressUpdatesToServer = useCallback(async () => {
    if (isUpdatingProgress.current) return;
    isUpdatingProgress.current = true;

    const updates = { ...progressUpdateQueue.current };
    progressUpdateQueue.current = {};

    for (const [path, progress] of Object.entries(updates)) {
      try {
        await axios.post(
          `http://localhost:3001/api/progress/${selectedCourse}`,
          {
            path,
            progress,
          }
        );
        console.log("Progress successfully updated to backend for:", path);
      } catch (error) {
        console.error("Error updating progress to backend:", error);
        // Volver a añadir la actualización fallida a la cola
        progressUpdateQueue.current[path] = progress;
      }
    }

    isUpdatingProgress.current = false;
  }, [selectedCourse]);

  useEffect(() => {
    const intervalId = setInterval(sendProgressUpdatesToServer, 30000); // Enviar actualizaciones cada 30 segundos
    return () => clearInterval(intervalId);
  }, [sendProgressUpdatesToServer]);

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

  const customSort = (a, b) => {
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

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    // Establece el folderPath con el nombre del curso
    setFolderPath(`/${courseId}`);
    setStructure(null);
    setSelectedContent(null);
  };

  const goToHome = () => {
    setSelectedCourse(null);
    setStructure(null);
    setSelectedContent(null);
    setFolderPath("");
  };

  const renderTree = (node, path = "") => {
    return Object.entries(node)
      .sort(([a], [b]) => customSort(a, b))
      .map(([key, value]) => {
        const currentPath = path ? `${path}/${key}` : key;
        const isFolder = typeof value === "object" && !value.type;

        if (isFolder) {
          const isExpanded = expandedFolders[currentPath];
          return (
            <div key={currentPath}>
              <div
                className="flex items-center cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => toggleFolder(currentPath)}
              >
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
                <span className="" title={key}>
                  {key}
                </span>
              </div>
              {isExpanded && (
                <div className="ml-4">{renderTree(value, currentPath)}</div>
              )}
            </div>
          );
        } else {
          let FileIcon =
            value.type === "video"
              ? FileVideo
              : value.type === "html"
              ? FileText
              : File;
          let iconColor =
            value.type === "video"
              ? "text-red-500"
              : value.type === "html"
              ? "text-green-500"
              : "text-gray-500";
          const completePath = `${courseInfo.localPath}/${value.path}`;
          const filePath = `http://localhost:3001/api/file?path=${encodeURIComponent(
            completePath
          )}`;
          const progress = videoProgress[filePath];
          const isWatched = videoHistory[filePath] || false;
          const progressPercentage = isWatched
            ? 100
            : progress
            ? (progress.currentTime / progress.duration) * 100
            : 0;

          return (
            <div key={currentPath} className="flex flex-col">
              <div
                className="flex items-center cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => {
                  selectContent(value.type, value.path);
                }}
              >
                <FileIcon size={16} className={`mr-2 ${iconColor}`} />
                {value.type === "video" && (
                  <input
                    type="checkbox"
                    checked={isWatched}
                    onChange={(e) =>
                      handleWatchedChange(filePath, e.target.checked)
                    }
                    className="ml-2 mr-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span>{key}</span>
              </div>
              {value.type === "video" && (
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
          );
        }
      });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {!selectedCourse ? (
        <Home onCourseSelect={handleCourseSelect} />
      ) : (
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/4 bg-white border-r shadow-md overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">CursoVisor</h2>
              <button
                onClick={goToHome}
                className="text-blue-500 hover:text-blue-700"
              >
                <HomeIcon size={24} />
              </button>
            </div>
            {structure ? (
              renderTree(structure)
            ) : (
              <p>Cargando estructura de carpetas...</p>
            )}
          </div>

          <div className="w-full p-4">
            <div className="w-full h-screen">
              {courseInfo && (
                <div className="mb-4 flex items-center">
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
                selectedContent.type === "video" ? (
                  <video
                    src={`http://localhost:3001/api/file?path=${encodeURIComponent(
                      selectedContent.fullPath
                    )}`}
                    controls
                    className="w-full rounded-lg shadow-2xl"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onPause={handleVideoPause}
                    onPlay={handleVideoPlay}
                    key={selectedContent.fullPath}
                    ref={(videoElement) => {
                      if (videoElement) {
                        const savedProgress =
                          videoProgress[selectedContent.fullPath];
                        if (
                          savedProgress &&
                          savedProgress.currentTime &&
                          isFinite(savedProgress.currentTime)
                        ) {
                          videoElement.currentTime = savedProgress.currentTime;
                        }
                      }
                    }}
                  />
                ) : selectedContent.type === "html" ? (
                  <div className="flex justify-center items-center h-full">
                    <iframe
                      title="Contenido HTML"
                      src={selectedContent.path}
                      className="w-full max-w-[75ch] min-h-screen border-spacing-10 rounded-lg shadow-2xl p-2"
                    />
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Este tipo de archivo no se puede previsualizar.
                  </p>
                )
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
        </div>
      )}
    </div>
  );
};

export default App;
