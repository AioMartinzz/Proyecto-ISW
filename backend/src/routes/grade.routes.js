import express from "express";
import {
  createGrade,
  deleteGrade,
  updateGrade,
} from "../controllers/grade.controller.js";

const router = express.Router();

// Ruta para crear una calificacion
router.post("/", createGrade);

// Ruta para actualizar una Grade
router.put("/:id", updateGrade);

// Ruta para eliminar una Grade
router.delete("/:id", deleteGrade);

// Ruta para obtener las calificaciones
router.get("/", getGrades);

export default router;
