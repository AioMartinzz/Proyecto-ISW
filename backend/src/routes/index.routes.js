"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
<<<<<<< HEAD
import anotacionRoutes from "./anotacion.routes.js";
import asignaturaRoutes from "./asignatura.routes.js";
import cursoRoutes from "./curso.routes.js";
import alumnoRoutes from "./alumno.routes.js"; 
=======
import anotacionRoutes from "./anotacion.routes.js"; // Importar las rutas de anotaciones
import asistencuaRoutes from "./asistencia.routes.js"; // Importar las rutas de asistencia
import emailRoutes from "./email.routes.js";
>>>>>>> main

const router = Router();

router
<<<<<<< HEAD
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/anotaciones", anotacionRoutes)
    .use("/asignaturas", asignaturaRoutes)
    .use("/cursos", cursoRoutes)
    .use("/alumnos", alumnoRoutes); 
=======
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/anotaciones", anotacionRoutes) // Agregar la ruta para anotaciones
  .use("/asistencia", asistencuaRoutes) // Agregar la ruta para asistencia
  .use("/email", emailRoutes);
>>>>>>> main

export default router;
