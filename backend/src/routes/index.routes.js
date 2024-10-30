"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import anotacionRoutes from "./anotacion.routes.js";
import asignaturaRoutes from "./asignatura.routes.js";
import cursoRoutes from "./curso.routes.js";
import alumnoRoutes from "./alumno.routes.js";
import asistencuaRoutes from "./asistencia.routes.js"; // Importar las rutas de asistencia
import emailRoutes from "./email.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/anotaciones", anotacionRoutes)
  .use("/asignaturas", asignaturaRoutes)
  .use("/cursos", cursoRoutes)
  .use("/alumnos", alumnoRoutes)
  .use("/email", emailRoutes)
  .use("/asistencias", asistencuaRoutes);

export default router;
