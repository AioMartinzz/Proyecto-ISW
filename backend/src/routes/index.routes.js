"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import anotacionRoutes from "./anotacion.routes.js"; // Importar las rutas de anotaciones
import asistencuaRoutes from "./asistencia.routes.js"; // Importar las rutas de asistencia

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/anotaciones", anotacionRoutes) // Agregar la ruta para anotaciones
  .use("/asistencia", asistencuaRoutes); // Agregar la ruta para asistencia

export default router;
