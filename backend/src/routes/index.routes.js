"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import anotacionRoutes from "./anotacion.routes.js"; // Importar las rutas de anotaciones

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/anotaciones", anotacionRoutes); // Agregar la ruta para anotaciones

export default router;
