const { spawn } = require("child_process");
const path = require("path");

// Configuración
const CONFIG = {
  server: {
    file: "server.exe",
    ready: "Server running on port", // Mensaje que indica que el servidor está listo
  },
  frontend: {
    file: "frontend.exe",
  },
};

// Función principal
async function startApplication() {
  console.log("Iniciando aplicación...");

  // Iniciar el servidor
  const server = spawn(path.join(process.cwd(), CONFIG.server.file));

  // Manejar la salida del servidor
  server.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`[Servidor]: ${output}`);

    // Si detectamos que el servidor está listo, iniciamos el frontend
    if (output.includes(CONFIG.server.ready)) {
      startFrontend(server);
    }
  });

  server.stderr.on("data", (data) => {
    console.error(`[Error Servidor]: ${data}`);
  });

  // Manejar cierre del servidor
  server.on("close", (code) => {
    console.log(`Servidor cerrado con código: ${code}`);
    process.exit();
  });
}

// Función para iniciar el frontend
function startFrontend(server) {
  console.log("Iniciando frontend...");
  const frontend = spawn(path.join(process.cwd(), CONFIG.frontend.file));

  // Manejar la salida del frontend
  frontend.stdout.on("data", (data) => {
    console.log(`[Frontend]: ${data}`);
  });

  frontend.stderr.on("data", (data) => {
    console.error(`[Error Frontend]: ${data}`);
  });

  // Cuando el frontend se cierre, cerrar el servidor
  frontend.on("close", (code) => {
    console.log(`Frontend cerrado con código: ${code}`);
    server.kill();
  });
}

// Iniciar la aplicación
startApplication().catch(console.error);
