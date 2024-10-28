"use strict";
import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  getAsistenciasByAlumno,
  updateAsistencia,
} from "../controllers/asistencia.controller.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getAsistencias);
router.get("/:id_alumno", getAsistenciasByAlumno);

router.post("/", createAsistencia);

router.put("/:id", updateAsistencia);
export default router;