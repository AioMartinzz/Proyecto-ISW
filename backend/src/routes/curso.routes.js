import { Router } from "express";
import {
  createCurso,
  deleteCurso,
  getCursos,
  updateCurso,
} from "../controllers/curso.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = Router();

// Ruta para crear un curso
router.post(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  createCurso,
);

// Ruta para obtener todos los cursos
router.get(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR]),
  getCursos,
);

// Ruta para eliminar un curso
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  deleteCurso,
);

// Ruta para modificar un curso
router.put(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  updateCurso,
);

export default router;
