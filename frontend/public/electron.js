const { app, BrowserWindow } = require("electron");
const path = require("path");
let isDev, mainWindow, server;

(async () => {
  isDev = await import("electron-is-dev").then((module) => module.default);

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
      },
    });

    mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // Evitar recargar la ventana
    mainWindow.webContents.on("beforeunload", (event) => {
      event.preventDefault(); // Evitar la recarga
      event.returnValue = ""; // Para mostrar un mensaje de confirmación (opcional)
    });

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  }

  app.whenReady().then(() => {
    createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("quit", () => {
    if (server) {
      server.close();
    }
  });
})();
