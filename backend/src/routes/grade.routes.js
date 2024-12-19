import express from "express";
import {
  createGrade,
  deleteGrade,
  getGrades,
  getGradesByStudent,
  updateGrade,
} from "../controllers/grade.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = express.Router();

// Ruta para crear una calificacion
router.post(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR]),
  createGrade,
);

// Ruta para actualizar una calificacion
router.put(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR]),
  updateGrade,
);

// Ruta para eliminar una calificacion
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR]),
  deleteGrade,
);

// Ruta para obtener las calificaciones
router.get(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR, ROLES.APODERADO]),
  getGrades,
);

// Nueva ruta para obtener calificaciones por estudiante
router.get(
  "/student/:estudiante_id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR]),
  getGradesByStudent,
);

export default router;
