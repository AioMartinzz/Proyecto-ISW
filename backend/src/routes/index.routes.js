"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import anotacionRoutes from "./anotacion.routes.js"; // Importar las rutas de anotaciones
import asistencuaRoutes from "./asistencia.routes.js"; // Importar las rutas de asistencia
import emailRoutes from "./email.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/anotaciones", anotacionRoutes) // Agregar la ruta para anotaciones
  .use("/asistencia", asistencuaRoutes) // Agregar la ruta para asistencia
  .use("/email", emailRoutes);

export default router;
