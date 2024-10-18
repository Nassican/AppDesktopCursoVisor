const rcedit = require("rcedit");
const path = require("path");
const fs = require("fs");

const exePath = path.join(__dirname, "dist", "app-launcher.exe");
const iconPath = path.join(__dirname, "public", "cursoVisor.ico");

console.log("Ruta del ejecutable:", exePath);
console.log("Ruta del icono:", iconPath);

if (!fs.existsSync(exePath)) {
  console.error("Error: El archivo ejecutable no existe");
  process.exit(1);
}

if (!fs.existsSync(iconPath)) {
  console.error("Error: El archivo de icono no existe");
  process.exit(1);
}

rcedit(exePath, {
  icon: iconPath,
  "version-string": {
    FileDescription: "Launcher de la aplicación",
    ProductName: "App Launcher",
    CompanyName: "Tu Compañía",
    LegalCopyright: "© 2023 Tu Compañía",
    OriginalFilename: "app-launcher.exe",
    FileVersion: "1.0.0",
    ProductVersion: "1.0.0",
  },
  "file-version": "1.0.0",
  "product-version": "1.0.0",
})
  .then(() => {
    console.log("Icono y propiedades actualizados exitosamente!");
  })
  .catch((err) => {
    console.error("Error al actualizar el icono y las propiedades:", err);
  });
