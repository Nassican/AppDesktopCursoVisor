import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { fileHistoryService } from "./services/api/fileHistoryService";
import Home from "./components/Home/Home";

import { getFileName, getSectionName } from "./utils/fileUtils";
import { useFolder } from "./hooks/useFolder";
import CourseView from "./components/MainContent/ContentView/CourseView";

const PROGRESS_UPDATE_INTERVAL = 10000; // 10 seconds

const App = () => {
  const [structure, setStructure] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [, setFolderPath] = useState("");
  const [videoProgress, setVideoProgress] = useState({});
  const [videoHistory, setVideoHistory] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const progressUpdateTimerRef = useRef(null);
  const lastProgressUpdateRef = useRef({});
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const { expandedFolders, setExpandedFolders, toggleFolder } = useFolder();

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
      if (video.paused) return;

      // Solo actualizar cada 1 segundo
      const currentTime = Math.floor(video.currentTime);
      const lastTime =
        lastProgressUpdateRef.current[selectedContent.path]?.currentTime;

      if (lastTime === undefined || Math.abs(currentTime - lastTime) >= 1) {
        const newProgress = {
          currentTime: video.currentTime,
          duration: video.duration,
        };
        updateVideoProgressLocally(selectedContent.path, newProgress);

        if (video.currentTime >= video.duration) {
          handleWatchedChange(selectedContent.path, true);
        }
      }
    },
    [selectedContent, handleWatchedChange, updateVideoProgressLocally]
  );

  const handleVideoEnded = useCallback(() => {
    if (selectedContent) {
      handleWatchedChange(selectedContent.path, true);
    }
  }, [selectedContent, handleWatchedChange]);

  const handleVideoPause = useCallback(() => {
    setIsVideoPaused(true);
    if (selectedContent) {
      const lastProgress = lastProgressUpdateRef.current[selectedContent.path];
      if (lastProgress) {
        updateVideoProgressToBackend(selectedContent.path, lastProgress);
      }
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {!selectedCourse ? (
        <Home onCourseSelect={handleCourseSelect} />
      ) : (
        <CourseView
          structure={structure}
          selectedCourse={selectedCourse}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          videoProgress={videoProgress}
          videoHistory={videoHistory}
          handleWatchedChange={handleWatchedChange}
          selectContent={selectContent}
          calculateFolderProgress={calculateFolderProgress}
          goToHome={goToHome}
          courseInfo={courseInfo}
          selectedContent={selectedContent}
          getSectionName={getSectionName}
          getFileName={getFileName}
          handleVideoTimeUpdate={handleVideoTimeUpdate}
          handleVideoPause={handleVideoPause}
          handleVideoPlay={handleVideoPlay}
          handleVideoEnded={handleVideoEnded}
        />
      )}
    </div>
  );
};

export default App;
