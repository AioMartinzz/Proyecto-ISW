"use strict";
import { Router } from "express";
import {
  createAnotacion,
  getAnotacionesByProfesor,
  updateAnotacion,
  deleteAnotacion,
  getAnotacionesByApoderado,
  getAnotacionesByAlumno,
} from "../controllers/anotacion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = Router();

router.use(authenticateJwt);

// Rutas para Profesores
router.post("/", authorizeRole([ROLES.PROFESOR]), createAnotacion); // Crear anotación
router.get("/profesor", authorizeRole([ROLES.PROFESOR]), getAnotacionesByProfesor); // Ver anotaciones creadas
router.patch("/:id", authorizeRole([ROLES.PROFESOR]), updateAnotacion); // Modificar anotación
router.delete("/:id", authorizeRole([ROLES.PROFESOR]), deleteAnotacion); // Eliminar anotación

// Rutas para Apoderados
router.get("/apoderado/:alumnoId", authorizeRole([ROLES.APODERADO]), getAnotacionesByApoderado); // Ver anotaciones de un alumno a cargo

// Rutas para Alumnos
router.get("/alumno/:alumnoId", authorizeRole([ROLES.ALUMNO]), getAnotacionesByAlumno); // Ver resumen de anotaciones del alumno

export default router;
