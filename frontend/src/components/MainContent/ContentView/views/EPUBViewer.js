import React, { useState, useEffect } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import {
  Sun,
  Moon,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Columns,
  Plus,
  Minus,
} from "lucide-react";
import Loader from "../../../common/Loader";

// Definición de temas del lector
const lightReaderTheme = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
};

const darkReaderTheme = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#ccc",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#1a1a1a",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#ccc",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#1a1a1a",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#2d2d2d",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#fff",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "white",
  },
};

const sepiaReaderTheme = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#f4ecd8",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#433422",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#f4ecd8",
  },
};

// Configuración de temas
const themes = {
  light: {
    body: {
      background: "#ffffff",
      color: "#000000",
    },
    readerTheme: lightReaderTheme,
  },
  sepia: {
    body: {
      background: "#f4ecd8",
      color: "#433422",
    },
    readerTheme: sepiaReaderTheme,
  },
  dark: {
    body: {
      background: "#1a1a1a",
      color: "#dddddd",
    },
    readerTheme: darkReaderTheme,
  },
};

const EPUBViewer = ({ filePath }) => {
  const [size, setSize] = useState(100);
  const [location, setLocation] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(false);
  const [theme, setTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [spread, setSpread] = useState("auto");

  // Cargar configuración guardada
  useEffect(() => {
    const loadSavedSettings = () => {
      const savedLocation = localStorage.getItem(`epub-location-${filePath}`);
      const savedTheme = localStorage.getItem(`epub-theme-${filePath}`);
      const savedSize = localStorage.getItem(`epub-size-${filePath}`);

      if (savedLocation) setLocation(savedLocation);
      if (savedTheme) setTheme(savedTheme);
      if (savedSize) setSize(parseInt(savedSize));
    };

    loadSavedSettings();
  }, [filePath]);

  // Actualizar tema
  const updateTheme = (rendition, themeName) => {
    if (!rendition) return;
    const theme = themes[themeName];

    rendition.themes.override("color", theme.body.color);
    rendition.themes.override("background", theme.body.background);

    // Aplicar estilos adicionales
    rendition.getContents().forEach((content) => {
      content.addStylesheetRules([
        ["body", theme.body],
        ["*", { color: theme.body.color }],
      ]);
    });
  };

  // Manejadores de eventos
  const locationChanged = (epubcifi) => {
    if (isNavigating) return;

    setLocation(epubcifi);
    localStorage.setItem(`epub-location-${filePath}`, epubcifi);

    if (rendition && rendition.location) {
      try {
        const currentLocation = rendition.location.start;
        if (currentLocation && currentLocation.displayed) {
          const current = currentLocation.displayed.page;
          // Obtener el total de páginas del libro
          const total =
            rendition.book.package.metadata.numberOfPages ||
            currentLocation.displayed.total ||
            Math.ceil(rendition.book.locations.total / 2);

          setCurrentPage(current);
          setTotalPages(total);
        }
      } catch (error) {
        console.error("Error actualizando la página:", error);
      }
    }
  };

  const changeSize = (newSize) => {
    setSize(newSize);
    localStorage.setItem(`epub-size-${filePath}`, newSize);

    if (rendition) {
      rendition.themes.fontSize(`${newSize}%`);

      // Recalcular el número total de páginas después de cambiar el tamaño
      rendition.book.ready.then(() => {
        rendition.book.locations.generate(1024).then(() => {
          const totalFromMetadata =
            rendition.book.package.metadata.numberOfPages;
          if (totalFromMetadata) {
            setTotalPages(parseInt(totalFromMetadata));
          } else {
            const total = Math.ceil(rendition.book.locations.total / 2);
            setTotalPages(total);
          }

          // Actualizar la página actual
          if (rendition.location) {
            const currentLocation = rendition.location.start;
            if (currentLocation && currentLocation.displayed) {
              setCurrentPage(currentLocation.displayed.page);
            }
          }
        });
      });
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem(`epub-theme-${filePath}`, newTheme);
    if (rendition) {
      updateTheme(rendition, newTheme);
    }
  };

  const navigation = {
    next: () => {
      setIsNavigating(true);
      rendition.next().finally(() => {
        setTimeout(() => setIsNavigating(false), 100);
      });
    },
    prev: () => {
      setIsNavigating(true);
      rendition.prev().finally(() => {
        setTimeout(() => setIsNavigating(false), 100);
      });
    },
    toLocation: (href) => {
      setIsNavigating(true);
      rendition.display(href).finally(() => {
        setTimeout(() => {
          setIsNavigating(false);
          setShowToc(false);
        }, 300);
      });
    },
  };

  const toggleSpread = () => {
    const newSpread = spread === "auto" ? "none" : "auto";
    setSpread(newSpread);
    if (rendition) {
      rendition.spread(newSpread);
    }
  };

  // Renderizado de controles
  const renderControls = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border-r border-gray-300 dark:border-gray-600 px-4">
          <button
            onClick={() => changeSize(Math.max(70, size - 10))}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
            disabled={size <= 70}
          >
            <div className="flex items-center">
              <span className="hidden sm:inline">A</span>
              <Minus size={16} />
            </div>
          </button>
          <span className="w-16 text-center font-medium">{size}%</span>
          <button
            onClick={() => changeSize(Math.min(200, size + 10))}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
            disabled={size >= 200}
          >
            <div className="flex items-center">
              <span className="hidden sm:inline">A</span>
              <Plus size={16} />
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-2 border-r border-gray-300 dark:border-gray-600 px-4">
          <button
            onClick={navigation.prev}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[80px] text-center font-medium">
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={navigation.next}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border-r border-gray-300 dark:border-gray-600 pr-4">
          {[
            { key: "light", icon: Sun, label: "Claro" },
            { key: "sepia", icon: BookOpen, label: "Lectura" },
            { key: "dark", icon: Moon, label: "Oscuro" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => changeTheme(key)}
              className={`p-2 rounded-lg flex items-center transition-colors ${
                theme === key
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={16} className="mr-2" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={toggleSpread}
          className={`p-2 rounded-lg flex items-center transition-colors ${
            spread === "auto"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {spread === "auto" ? (
            <>
              <Columns size={16} className="mr-2" />
              <span className="hidden sm:inline">Doble</span>
            </>
          ) : (
            <>
              <LayoutTemplate size={16} className="mr-2" />
              <span className="hidden sm:inline">Simple</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Actualizar la inicialización del rendition para manejar mejor las páginas
  const getRendition = (rendition) => {
    setRendition(rendition);
    rendition.themes.fontSize(`${size}%`);
    updateTheme(rendition, theme);

    // Configurar eventos
    rendition.on("keyup", (event) => {
      if (event.key === "ArrowRight") navigation.next();
      if (event.key === "ArrowLeft") navigation.prev();
    });

    // Generar locations después de cargar
    rendition.book.ready.then(() => {
      rendition.book.locations.generate(1024).then(() => {
        // Intentar obtener el número total de páginas de los metadatos
        const totalFromMetadata = rendition.book.package.metadata.numberOfPages;
        if (totalFromMetadata) {
          setTotalPages(parseInt(totalFromMetadata));
        } else {
          // Calcular el total basado en las locations
          const total = Math.ceil(rendition.book.locations.total / 2);
          setTotalPages(total);
        }
      });
    });
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col">
      <div className="h-full flex flex-col">
        {renderControls()}

        <div className="flex-1 flex relative">
          {showToc && (
            <div className="absolute left-0 top-0 w-72 h-full bg-white dark:bg-gray-800 border-r shadow-lg z-10">
              <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                {toc.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => navigation.toLocation(chapter.href)}
                    className="block w-full text-left py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1 transition-colors"
                  >
                    {chapter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1">
            <ReactReader
              url={filePath}
              location={location}
              locationChanged={locationChanged}
              getRendition={getRendition}
              tocChanged={setToc}
              epubOptions={{
                flow: "paginated",
                manager: "default",
                snap: false,
                spread: spread,
                allowScriptedContent: true,
                allowPopups: false,
              }}
              readerStyles={themes[theme].readerTheme}
              loadingView={
                <div className="flex items-center justify-center h-full">
                  <Loader size="large" color="blue" />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPUBViewer;
