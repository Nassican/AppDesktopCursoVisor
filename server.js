const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CURRENT_FOLDER = path.join(__dirname, "cursos_videos");
let DEFAULT_FOLDER = CURRENT_FOLDER;
const COURSES_DATA_FILE = path.join(__dirname, "courses_data.json");

app.post("/api/add-course-folder", async (req, res) => {
  try {
    const { folderPath } = req.body;
    if (!folderPath) {
      return res.status(400).json({ error: "Se requiere folderPath" });
    }

    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) {
      return res
        .status(400)
        .json({ error: "La ruta especificada no es una carpeta" });
    }

    let coursesData = await readCoursesDataFile();

    const courseId = path.basename(folderPath);

    if (coursesData[courseId]) {
      return res
        .status(400)
        .json({ error: "Ya existe un curso con este nombre" });
    }

    coursesData[courseId] = {
      id: courseId,
      name: courseId.replace(/_/g, " "),
      description: `Descripción del curso ${courseId}`,
      totalVideos: 0,
      videosWatched: 0,
      icon: "SiFolder",
      videos: {},
      progress: {},
      localPath: folderPath,
    };

    // Actualizar la estructura del curso
    const structure = await getDirectoryStructure(folderPath);
    coursesData[courseId].totalVideos = countVideos(structure);

    await writeCoursesDataFile(coursesData);

    console.log(`Nuevo curso agregado: ${courseId}`, folderPath);
    res.json({
      success: true,
      message: "Nuevo curso agregado correctamente",
      courseId,
    });
  } catch (error) {
    console.error("Error al agregar el nuevo curso:", error);
    res.status(500).json({ error: "Error al agregar el nuevo curso" });
  }
});

async function initializeCoursesData() {
  try {
    let coursesData = await readCoursesDataFile();
    const coursesDir = path.join(__dirname, "cursos_videos");
    const courses = await fs.readdir(coursesDir, { withFileTypes: true });

    for (const course of courses.filter((dirent) => dirent.isDirectory())) {
      const courseId = course.name;
      const coursePath = path.join(coursesDir, courseId);
      if (!coursesData[courseId]) {
        const structure = await getDirectoryStructure(coursePath);
        const totalVideos = countVideos(structure);

        coursesData[courseId] = {
          id: courseId,
          name: courseId.replace(/_/g, " "),
          description: `Descripción del curso ${courseId}`,
          totalVideos,
          videosWatched: 0,
          icon: "SiFolder",
          videos: {},
          progress: {},
          localPath: coursePath,
        };
      } else if (!coursesData[courseId].localPath) {
        // Si ya existe el curso pero no tiene localPath, lo añadimos
        coursesData[courseId].localPath = coursePath;
      }
    }

    await writeCoursesDataFile(coursesData);
    console.log(
      "Estructura de cursos inicializada y guardada en courses_data.json"
    );
  } catch (error) {
    console.error("Error al inicializar la estructura de cursos:", error);
  }
}

function encodePathComponent(component) {
  return component.split('\\').join('/').split('/').map(encodeURIComponent).join('/');
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
            fullPath: fullPath, // Añadimos la ruta completa
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

app.post("/api/set-folder", async (req, res) => {
  try {
    const { folderPath } = req.body;
    if (await fs.stat(folderPath)) {
      console.log("Carpeta establecida:", folderPath);
      DEFAULT_FOLDER = folderPath;
      res.json({ success: true, message: "Carpeta establecida correctamente" });
    } else {
      res.status(400).json({ error: "La carpeta no existe" });
    }
  } catch (error) {
    console.error("Error al establecer la carpeta:", error);
    res.status(500).json({ error: "Error al establecer la carpeta" });
  }
});

app.post("/api/folder-structure", async (req, res) => {
  try {
    const { courseId } = req.body;
    const coursesData = await readCoursesDataFile();
    const courseData = coursesData[courseId];

    if (!courseData || !courseData.localPath) {
      return res
        .status(404)
        .json({ error: "Course not found or invalid local path" });
    }

    console.log("Requesting folder structure for:", courseData.localPath);
    const structure = await getDirectoryStructure(courseData.localPath);
    res.json(structure);
  } catch (error) {
    console.error("Error in /api/folder-structure:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/file/:encodedPath(*)", async (req, res) => {
  const { courseId } = req.body;
  const coursesData = await readCoursesDataFile();
  const courseData = coursesData[courseId];

  console.log("Requesting file:", courseId, req);

  console.log("Attempting to send file:", fullPath, "As:", filePath);

  fs.access(fullPath)
    .then(() => {
      res.sendFile(fullPath);
    })
    .catch((error) => {
      console.error("Error: File not found", fullPath, error);
      res.status(404).send("File not found");
    });
});

app.get("/api/file", async (req, res) => {
  try {
    const { path: encodedPath } = req.query;
    
    if (!encodedPath) {
      return res.status(400).json({ error: "Path not provided" });
    }

    const fullPath = decodeURIComponent(encodedPath);
    console.log("Attempting to send file:", fullPath);

    // Verificar si el archivo existe
    await fs.access(fullPath);

    // Enviar el archivo
    res.sendFile(fullPath);
  } catch (error) {
    console.error("Error: File not found or access denied", error);
    res.status(404).send("File not found or access denied");
  }
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
    const coursesDir = path.join(__dirname, "cursos_videos");
    const coursesData = await readCoursesDataFile();

    const courseList = Object.values(coursesData).map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      totalVideos: course.totalVideos,
      videosWatched: course.videosWatched,
      icon: course.icon,
      localPath: course.localPath, // Incluimos la ruta local en la respuesta
    }));

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
