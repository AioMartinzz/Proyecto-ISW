import { Router } from "express";
import {
  createCurso,
  deleteCurso,
  getCursos,
  updateCurso,
} from "../controllers/curso.controller.js";

const router = Router();

// Ruta para crear un curso
router.post("/", createCurso);

// Ruta para obtener todos los cursos
router.get("/", getCursos);

// Ruta para eliminar un curso
router.delete("/:id", deleteCurso);

// Ruta para modificar un curso
router.put("/:id", updateCurso);

export default router;
