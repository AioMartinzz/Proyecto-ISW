import express from "express";
import {
  createAlumno,
  deleteAlumno,
  getAlumnos,
  updateAlumno,
} from "../controllers/alumno.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = express.Router();

router.post(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  createAlumno,
);
router.get(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR, ROLES.APODERADO]),
  getAlumnos,
);
router.put(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  updateAlumno,
);
router.delete(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  deleteAlumno,
);

export default router;
