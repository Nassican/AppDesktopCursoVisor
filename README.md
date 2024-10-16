# CursoVisor

**CursoVisor** es una aplicación que permite la visualización y el seguimiento de cursos a través de una estructura de carpetas de video y HTML. El sistema permite gestionar el progreso de los videos y mantener un registro de los videos vistos por cada usuario. La aplicación cuenta con un frontend en React y un backend en Express.js.

## Características

- **Visualización de cursos**: Interfaz de usuario intuitiva para navegar por carpetas y visualizar archivos de video y HTML.
- **Progreso de videos**: Guarda el progreso de visualización de cada video para que puedas continuar desde donde dejaste.
- **Historial de visualización**: Permite marcar los videos como vistos, con un sistema de sincronización entre el frontend y el backend.

## Requisitos

- Node.js v12.0.0 o superior
- npm v6.0.0 o superior

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Nassican/CursoVisor.git
   cd CursoVisor
   ```

2. Instala las dependencias para el frontend y el backend usando el siguiente comando:
   ```bash
   npm run install:all
   ```

3. Crea una carpeta `cursos_videos` en el directorio `backend` y coloca allí los archivos de video y HTML que se usarán para los cursos:
   ```bash
   mkdir backend/cursos_videos
   ```

4. Inicia la aplicación:
   ```bash
   npm start
   ```

   Este comando ejecutará el frontend y el backend en paralelo:
   - El **backend** estará disponible en `http://localhost:3001`.
   - El **frontend** estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

```plaintext
CursoVisor/
├── backend/
│   ├── server.js                 # Servidor backend en Express.js
│   ├── cursos_videos/            # Carpeta para los videos de los cursos
│   ├── video_progress.json       # Archivo de progreso de videos
│   └── video_history.json        # Archivo de historial de videos
├── frontend/
│   ├── public/                   # Archivos públicos de React
│   └── src/                      # Código fuente de la aplicación frontend
└── package.json                  # Archivo de configuración de npm
```

## Scripts de npm

- **`npm start`**: Inicia el backend y el frontend en paralelo.
- **`npm run start:backend`**: Inicia solo el servidor backend.
- **`npm run start:frontend`**: Inicia solo el servidor frontend.
- **`npm run install:all`**: Instala todas las dependencias para el frontend y el backend.

## Tecnologías Utilizadas

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Gestión de dependencias**: npm
- **Desarrollo paralelo**: concurrently

## Uso

1. Navega a `http://localhost:3000` en tu navegador.
2. Visualiza los videos y archivos HTML desde la interfaz, guarda tu progreso y marca los videos como vistos.
3. Todo el progreso se guarda en el backend y puede ser recuperado cuando vuelvas a iniciar sesión.

## Contribución

Si deseas contribuir a este proyecto, por favor:
- Realiza un fork del repositorio.
- Crea una nueva rama (`git checkout -b feature/nueva-feature`).
- Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva feature'`).
- Haz push de tus cambios a tu fork (`git push origin feature/nueva-feature`).
- Crea un Pull Request.

## Licencia

Este proyecto está bajo la licencia ISC.