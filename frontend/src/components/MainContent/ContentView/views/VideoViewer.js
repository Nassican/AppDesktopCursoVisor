import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";

// Añade estos estilos CSS personalizados al inicio de tu archivo
const fullscreenStyles = `
  ::-webkit-media-controls {
    display: none !important;
  }
  
  .video-container:fullscreen {
    width: 100vw;
    height: 100vh;
    background: black;
  }
  
  .video-container:fullscreen video {
    height: 100%;
  }
  
  .video-container:-webkit-full-screen {
    width: 100vw;
    height: 100vh;
  }
  
  .video-container:-moz-full-screen {
    width: 100vw;
    height: 100vh;
  }
  
  .video-container:-ms-fullscreen {
    width: 100vw;
    height: 100vh;
  }
`;

const VideoViewer = ({
  filePath,
  onTimeUpdate,
  onPause,
  onPlay,
  onEnded,
  videoProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [lastSpacePress, setLastSpacePress] = useState(0);
  const DOUBLE_PRESS_DELAY = 300; // milisegundos para detectar doble presión
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSpeedMenuOpen) {
        setIsSpeedMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSpeedMenuOpen]);

  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [filePath]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      videoRef.current.pause();
      onPause?.();
    } else {
      videoRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, onPause, onPlay]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Solo si el video está enfocado o el contenedor está enfocado
      if (
        document.activeElement === videoRef.current ||
        document.activeElement === containerRef.current ||
        document.activeElement === document.body
      ) {
        if (e.code === "Space") {
          e.preventDefault(); // Prevenir el scroll de la página

          const currentTime = new Date().getTime();
          const timeDiff = currentTime - lastSpacePress;

          if (timeDiff < DOUBLE_PRESS_DELAY) {
            // Doble presión detectada - activar pantalla completa
            toggleFullScreen();
            setLastSpacePress(0); // Reiniciar el tiempo
          } else {
            // Primera presión - toggle play/pause
            togglePlay();
            setLastSpacePress(currentTime);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [lastSpacePress, togglePlay]); // Dependencia del último tiempo presionado

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
    onTimeUpdate?.(e);
  };

  const handleProgress = (e) => {
    const time = e.target.value;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (e) => {
    const value = e.target.value;
    videoRef.current.volume = value;
    setVolume(value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      // Fallback para navegadores que usan prefijos
      if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
        setIsFullscreen(true);
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setIsSpeedMenuOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (!isSpeedMenuOpen) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (!isSpeedMenuOpen) {
        setIsControlsVisible(false);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSpeedMenuOpen]);

  return (
    <>
      <style>{fullscreenStyles}</style>
      <div
        ref={containerRef}
        className="video-container relative flex-1 bg-black rounded-lg overflow-hidden group"
        tabIndex="0"
      >
        <video
          ref={videoRef}
          src={filePath}
          className="h-full w-full object-contain"
          tabIndex="0"
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onEnded={onEnded}
          onLoadedMetadata={(e) => {
            const video = e.target;
            setDuration(video.duration);
            const savedProgress = videoProgress[filePath];
            if (
              savedProgress &&
              savedProgress.currentTime &&
              isFinite(savedProgress.currentTime)
            ) {
              video.currentTime = savedProgress.currentTime;
            }
          }}
        />

        {/* Controles personalizados */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
            isControlsVisible || isSpeedMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Barra de progreso mejorada */}
          <div className="relative w-full h-3 group/progress">
            {/* Barra de fondo */}
            <div className="absolute w-full h-2 bg-gray-600/30 top-1/2 -translate-y-1/2 rounded-sm"></div>

            {/* Barra de progreso */}
            <div
              className="absolute h-2 bg-blue-500 top-1/2 -translate-y-1/2 rounded-sm pointer-events-none z-10"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>

            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgress}
              className="absolute w-full h-full opacity-0 cursor-pointer z-20
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:relative
                [&::-webkit-slider-thumb]:z-30
                [&::-moz-range-thumb]:appearance-none
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue-500
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:shadow-md
                [&::-moz-range-thumb]:relative
                [&::-moz-range-thumb]:z-30"
              style={{
                background: "transparent",
              }}
            />

            {/* Barra de hover */}
            <div className="absolute w-full h-1.5 bg-blue-500/20 top-1/2 -translate-y-1/2 rounded-sm opacity-0 group-hover/progress:opacity-100 pointer-events-none"></div>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* Control de volumen mejorado */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors p-1.5 rounded-full hover:bg-white/10"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition-colors p-1.5 rounded-full hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolume}
                  className="w-0 group-hover/volume:w-20 transition-all duration-300
            h-1.5 rounded-lg appearance-none cursor-pointer
            bg-gray-600/50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-0
            [&::-webkit-slider-thumb]:h-0
            group-hover/volume:[&::-webkit-slider-thumb]:w-3
            group-hover/volume:[&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-0
            [&::-moz-range-thumb]:h-0
            group-hover/volume:[&::-moz-range-thumb]:w-3
            group-hover/volume:[&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:hover:scale-125"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${
                      volume * 100
                    }%, rgba(156, 163, 175, 0.3) ${volume * 100}%)`,
                  }}
                />
              </div>

              <div className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Botones adicionales */}
            <div className="flex items-center gap-2">
              <div className="relative z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSpeedMenuOpen(!isSpeedMenuOpen);
                  }}
                  className="text-white hover:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-white/10 text-sm font-bold"
                >
                  {playbackSpeed}x
                </button>

                {isSpeedMenuOpen && (
                  <div className="absolute border border-gray-600 bottom-full right-0 mb-2 bg-black/90 rounded-lg shadow-lg overflow-hidden z-50">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                          playbackSpeed === speed
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullScreen}
                className="text-white hover:text-blue-400 transition-colors p-1.5 rounded-full hover:bg-white/10"
                title={
                  isFullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoViewer;
