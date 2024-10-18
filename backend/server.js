const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function getBasePath() {
  // En desarrollo, usa __dirname
  if (process.pkg === undefined) {
    return __dirname;
  }
  // En producción (ejecutable), usa process.execPath
  return path.dirname(process.execPath);
}

const BASE_PATH = getBasePath();
const DEFAULT_FOLDER = path.join(BASE_PATH, "cursos_videos");
const COURSES_DATA_FILE = path.join(BASE_PATH, "courses_data.json");

async function initializeCoursesData() {
  try {
    // Verificar si el archivo courses_data.json ya existe
    await fs.access(COURSES_DATA_FILE);
    console.log(
      "El archivo courses_data.json ya existe. No se inicializará la estructura."
    );
  } catch (error) {
    // Si el archivo no existe, inicializar la estructura
    console.log("Inicializando la estructura de cursos...");
    const coursesDir = path.join(BASE_PATH, "cursos_videos");
    const courses = await fs.readdir(coursesDir, { withFileTypes: true });
    let coursesData = {};

    for (const course of courses.filter((dirent) => dirent.isDirectory())) {
      const courseId = course.name;
      const structure = await getDirectoryStructure(
        path.join(coursesDir, courseId)
      );
      const totalVideos = countVideos(structure);

      coursesData[courseId] = {
        id: courseId,
        name: courseId.replace(/_/g, " "),
        description: `Descripción del curso ${courseId}`,
        totalVideos,
        videosWatched: 0,
        icon: "SiFolder", // Icono por defecto
        videos: {},
        progress: {},
      };
    }

    await writeCoursesDataFile(coursesData);
    console.log(
      "Estructura de cursos inicializada y guardada en courses_data.json"
    );
  }
}

function encodePathComponent(component) {
  return encodeURIComponent(component).replace(/%2F/g, "/");
}

async function getDirectoryStructure(dir, baseDir = "") {
  const structure = {};
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      const relativePath = path.join(baseDir, file.name);
      const encodedPath = encodePathComponent(relativePath);

      if (file.isDirectory()) {
        structure[file.name] = await getDirectoryStructure(
          fullPath,
          relativePath
        );
      } else {
        const ext = path.extname(file.name).toLowerCase();
        if (ext === ".mp4" || ext === ".html") {
          structure[file.name] = {
            type: ext === ".mp4" ? "video" : "html",
            path: encodedPath,
            watched: false,
          };
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  return structure;
}

async function readCoursesDataFile() {
  try {
    const data = await fs.readFile(COURSES_DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeCoursesDataFile(data) {
  await fs.writeFile(COURSES_DATA_FILE, JSON.stringify(data, null, 2));
}

app.post("/api/folder-structure", async (req, res) => {
  try {
    const { folderPath } = req.body;
    const dir = folderPath
      ? path.join(DEFAULT_FOLDER, folderPath)
      : DEFAULT_FOLDER;
    console.log("Requesting folder structure for:", dir);
    const structure = await getDirectoryStructure(dir);
    res.json(structure);
  } catch (error) {
    console.error("Error in /api/folder-structure:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/file/:encodedPath(*)", (req, res) => {
  const filePath = decodeURIComponent(req.params.encodedPath);
  const fullPath = path.join(DEFAULT_FOLDER, filePath);

  fs.access(fullPath)
    .then(() => {
      res.sendFile(fullPath);
    })
    .catch((error) => {
      console.error("Error: File not found", fullPath, error);
      res.status(404).send("File not found");
    });
});

app.get("/api/progress/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const coursesData = await readCoursesDataFile();
    const courseData = coursesData[courseId] || {
      videos: {},
      progress: {},
      icon: {},
    };
    res.json(courseData.progress);
  } catch (error) {
    console.error("Error reading progress:", error);
    res.status(500).json({ error: "Error reading progress" });
  }
});

app.post("/api/progress/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { path: videoPath, progress } = req.body;
    console.log("Received progress update:", courseId, videoPath, progress);

    if (
      !videoPath ||
      !progress ||
      typeof progress.currentTime === "undefined" ||
      typeof progress.duration === "undefined"
    ) {
      return res.status(400).json({ error: "Invalid progress data" });
    }

    let coursesData = await readCoursesDataFile();
    if (!coursesData[courseId]) {
      coursesData[courseId] = { videos: {}, progress: {} };
    }
    coursesData[courseId].progress[videoPath] = progress;

    // Actualizar total de videos y videos vistos
    const courseFolder = path.join(DEFAULT_FOLDER, courseId);
    const structure = await getDirectoryStructure(courseFolder);
    const totalVideos = countVideos(structure);
    const videosWatched = countWatchedVideos(coursesData[courseId]);

    coursesData[courseId].totalVideos = totalVideos;
    coursesData[courseId].videosWatched = videosWatched;

    await writeCoursesDataFile(coursesData);

    console.log("Progress updated successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Error updating progress" });
  }
});

app.post("/api/courses/:courseId/icon", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { icon } = req.body;
    let coursesData = await readCoursesDataFile();

    if (!coursesData[courseId]) {
      return res.status(404).json({ error: "Course not found" });
    }

    coursesData[courseId].icon = icon;
    await writeCoursesDataFile(coursesData);

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating course icon:", error);
    res.status(500).json({ error: "Error updating course icon" });
  }
});

app.post("/api/video-history/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { videoPath, isWatched } = req.body;
    let coursesData = await readCoursesDataFile();
    if (!coursesData[courseId]) {
      coursesData[courseId] = { videos: {}, progress: {} };
    }
    coursesData[courseId].videos[videoPath] = isWatched;

    // Actualizar el conteo de videos vistos
    const videosWatched = countWatchedVideos(coursesData[courseId]);
    coursesData[courseId].videosWatched = videosWatched;

    await writeCoursesDataFile(coursesData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ error: "Error updating history" });
  }
});

app.get("/api/video-history/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const coursesData = await readCoursesDataFile();
    const courseData = coursesData[courseId] || { videos: {} };
    res.json({ videos: courseData.videos });
  } catch (error) {
    console.error("Error reading video history:", error);
    res.status(500).json({ error: "Error reading video history" });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const coursesDir = path.join(BASE_PATH, "cursos_videos");
    const courses = await fs.readdir(coursesDir, { withFileTypes: true });
    const coursesData = await readCoursesDataFile();

    const courseList = await Promise.all(
      courses
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const courseId = dirent.name;
          const courseData = coursesData[courseId] || {};
          const structure = await getDirectoryStructure(
            path.join(coursesDir, courseId)
          );
          const totalVideos = countVideos(structure);

          return {
            id: courseId,
            name: courseId.replace(/_/g, " "),
            description: `Descripción del curso ${courseId}`,
            totalVideos,
            videosWatched: courseData.videosWatched || 0,
            icon: courseData.icon || "Folder", // Añadimos esta línea
          };
        })
    );

    res.json(courseList);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

app.get("/api/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const coursesData = await readCoursesDataFile();
    const courseData = coursesData[courseId];
    if (!courseData) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(courseData);
  } catch (error) {
    console.error("Error fetching course data:", error);
    res.status(500).json({ error: "Error fetching course data" });
  }
});

function countVideos(structure) {
  let count = 0;
  for (const key in structure) {
    if (typeof structure[key] === "object" && structure[key].type === "video") {
      count++;
    } else if (typeof structure[key] === "object" && !structure[key].type) {
      count += countVideos(structure[key]);
    }
  }
  return count;
}

function countWatchedVideos(courseData) {
  const { videos, progress } = courseData;
  const watchedVideos = new Set();

  // Contar videos marcados como vistos
  for (const [videoPath, isWatched] of Object.entries(videos)) {
    if (isWatched) {
      watchedVideos.add(videoPath);
    }
  }

  // Contar videos con progreso completo
  for (const [videoPath, videoProgress] of Object.entries(progress)) {
    if (videoProgress.currentTime === videoProgress.duration) {
      watchedVideos.add(videoPath);
    }
  }

  return watchedVideos.size;
}

initializeCoursesData()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al inicializar la estructura de cursos:", error);
  });
