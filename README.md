# CursoVisor

CursoVisor es una aplicación de escritorio para visualizar y gestionar cursos de video. Permite a los usuarios navegar por una estructura de carpetas, reproducir videos, ver contenido HTML y realizar un seguimiento del progreso de los cursos.

## Estructura del proyecto

El proyecto está dividido en tres partes principales:

1. Frontend (@frontend)
2. Backend (@backend)
3. Launcher (@launcher)

## Requisitos previos

- Node.js (versión 18 o superior)
- npm (normalmente viene con Node.js)

## Configuración y ejecución

### 1. Instalación de dependencias

Desde la raíz del proyecto, ejecuta:

```bash
npm run install:all
```

Este comando instalará las dependencias para el proyecto principal, el frontend, el backend y el launcher.

### 2. Construcción de los ejecutables

Para construir todos los ejecutables, ejecuta:

```bash
npm run build:all
```

Esto ejecutará los comandos de construcción para el frontend, el backend y el launcher.

O si solo deseas construir uno de ellos, puedes ejecutar:

#### Frontend

Para construir el ejecutable del frontend, ejecuta:

```bash
npm run build
```

Esto generará un ejecutable en la carpeta `dist`.

#### Backend

Para construir el ejecutable del backend, ejecuta:

```bash
npm run build
```

Esto generará un ejecutable en la carpeta `dist`.

#### Launcher

Para construir el ejecutable del launcher, ejecuta:

```bash
npm run build
```

Esto generará un ejecutable llamado `app-launcher.exe` en la carpeta `dist`.

### 3. Preparación de la carpeta de distribución

1. Crea una nueva carpeta llamada `CursoVisor`.
2. Copia los siguientes archivos y carpetas a `CursoVisor`:
   - El ejecutable `frontend.exe` del frontend de `@frontend/dist`
   - El ejecutable `server.exe` del backend de `@backend/dist`
   - El ejecutable `app-launcher.exe` de `@launcher/dist`
   - Crea una carpeta llamada `cursos_videos` dentro de `CursoVisor`

### 4. Ejecución de la aplicación

Para ejecutar la aplicación, simplemente haz doble clic en `app-launcher.exe` dentro de la carpeta `CursoVisor`. Esto iniciará el servidor backend y luego lanzará la aplicación frontend.

## Uso de la aplicación

1. Al iniciar la aplicación, verás una lista de cursos disponibles.
2. Haz clic en un curso para ver su contenido.
3. Navega por la estructura de carpetas en el panel izquierdo.
4. Haz clic en un archivo de video o HTML para visualizarlo en el panel derecho.
5. El progreso de los videos se guarda automáticamente.
6. Puedes marcar videos como vistos utilizando las casillas de verificación.

## Estructura de cursos

Los cursos deben estar organizados en la carpeta `cursos_videos` con la siguiente estructura:

```
cursos_videos/
├── Curso1/
│ ├── Módulo1/
│ │ ├── video1.mp4
│ │ ├── documento1.html
│ │ └── ...
│ ├── Módulo2/
│ │ └── ...
│ └── ...
├── Curso2/
│ └── ...
└── ...
```

## Notas adicionales

- Asegúrate de que la carpeta `cursos_videos` contenga al menos un curso para que la aplicación funcione correctamente.
- La aplicación guarda el progreso y el historial de visualización localmente.
- Puedes cambiar los iconos de los cursos haciendo clic en "Cambiar icono" en la página principal.

Licencia

Este proyecto está bajo la licencia MIT.
