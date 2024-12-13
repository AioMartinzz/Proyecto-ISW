"use strict";
import { Router } from "express";
import {
  createAsistencia,
  createAsistenciaReport,
  getAsistencias,
  getAsistenciasByAlumno,
  getAsistenciasByDate,
  updateAsistencia,
} from "../controllers/asistencia.controller.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = Router();

router.get(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.PROFESOR]),
  getAsistencias,
);

router.get(
  "/:id_alumno",
  authenticateJwt,
  authorizeRole([ROLES.PROFESOR]),
  getAsistenciasByAlumno,
);

router.post(
  "/fecha",
  authenticateJwt,
  authorizeRole([ROLES.PROFESOR]),
  getAsistenciasByDate,
);

router.post(
  "/informe/",
  authenticateJwt,
  authorizeRole([ROLES.PROFESOR]),
  createAsistenciaReport,
);

router.post(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.PROFESOR]),
  createAsistencia,
);

router.put(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.PROFESOR]),
  updateAsistencia,
);

export default router;
