import { Router } from "express";
import {
  createProfesor,
  deleteProfesor,
  getProfesor,
  getProfesores,
  updateProfesor,
} from "../controllers/profesor.controller.js";

const router = Router();

router.post("/", createProfesor); // Crear profesor
router.delete("/", deleteProfesor); // Eliminar profesor
router.get("/", getProfesores); // Obtener todos los profesores
router.get("/:id", getProfesor); // Obtener un profesor específico
router.put("/", updateProfesor); // Modificar profesor

export default router;
