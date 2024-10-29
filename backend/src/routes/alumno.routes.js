import express from "express";
import { createAlumno, updateAlumno, deleteAlumno, getAlumnos } from "../controllers/alumno.controller.js";

const router = express.Router();


router.post("/", createAlumno);
router.get("/", getAlumnos);
router.put("/:id", updateAlumno);
router.delete("/:id", deleteAlumno);

export default router;
