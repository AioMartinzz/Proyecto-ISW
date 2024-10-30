import express from "express";
import {
  createAlumno,
  deleteAlumno,
  getAlumnos,
  updateAlumno,
} from "../controllers/alumno.controller.js";

const router = express.Router();

router.post("/", createAlumno);
router.get("/", getAlumnos);
router.put("/:id", updateAlumno);
router.delete("/:id", deleteAlumno);

export default router;
