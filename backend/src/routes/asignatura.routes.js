import express from "express";
import {
  createAsignatura,
  deleteAsignatura,
  updateAsignatura,
  getAllAsignaturas,
} from "../controllers/asignatura.controller.js";

const router = express.Router();

// Ruta para crear una asignatura (sin restricción de rol)
router.post("/", createAsignatura);

// Ruta para actualizar una asignatura
router.put("/:id", updateAsignatura);

// Ruta para eliminar una asignatura
router.delete("/:id", deleteAsignatura);

router.get("/", getAllAsignaturas);

export default router;
