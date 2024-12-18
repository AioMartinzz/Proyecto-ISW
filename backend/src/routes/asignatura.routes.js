import express from "express";
import {
  createAsignatura,
  deleteAsignatura,
  getAllAsignaturas,
  updateAsignatura,
} from "../controllers/asignatura.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = express.Router();

// Ruta para crear una asignatura (sin restricción de rol)
router.post(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  createAsignatura,
);

// Ruta para actualizar una asignatura
router.put(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  updateAsignatura,
);

// Ruta para eliminar una asignatura
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  deleteAsignatura,
);

router.get(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR]),
  getAllAsignaturas,
);

export default router;
