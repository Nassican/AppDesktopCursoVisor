const { app, BrowserWindow } = require("electron");
const path = require("path");

// Determinar si estamos en desarrollo o producción
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      // Desactivar la barra de herramientas de Electron
    },
    icon: path.join(__dirname, "../public/catppuccin--video.ico"),
    title: "CursoVisor",
  });

  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, carga desde el servidor de desarrollo
    mainWindow.loadURL("http://localhost:3000");
    // Abrir DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, carga desde los archivos construidos
    mainWindow.removeMenu();
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  // Cuando la ventana se cierre
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Crear ventana cuando la app esté lista
app.whenReady().then(createWindow);

// Cerrar cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error);
});
