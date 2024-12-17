"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = Router();

// Ruta para iniciar sesión (disponible para todos)
router.post("/login", login);

// Ruta para que el Administrador registre nuevos usuarios con roles específicos
router.post(
  "/register",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  register,
);

// Ruta para cerrar sesión (disponible para todos los usuarios autenticados)
router.post("/logout", authenticateJwt, logout);

export default router;
