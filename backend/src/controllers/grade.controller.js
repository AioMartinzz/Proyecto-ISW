"use strict";
import { createGradeService, deleteGradeService, updateGradeService } from "../services/grade.service.js";


// Controlador para crear una calificacion
export async function createGrade(req, res) {
  try {
    const { nombre } = req.body;
    const [newGrade, error] = await createGradeService({ nombre });
    if (error) return res.status(500).json({ message: error });

    res.status(201).json({ message: "Grade creada exitosamente", data: newGrade });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la Grade" });
  }
}

// Controlador para editar una calificacion
export async function updateGrade(req, res) {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const [updatedGrade, error] = await updateGradeService(id, { nombre });
    if (error) return res.status(500).json({ message: error });

    res.status(200).json({ message: "Calificacion actualizada exitosamente", data: updatedGrade });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la Calificacion" });
  }
}

// Controlador para eliminar una calificacion
export async function deleteGrade(req, res) {
  try {
    const { id } = req.params;
    const [deletedGrade, error] = await deleteGradeService(id);
    if (error) return res.status(500).json({ message: error });

    res.status(200).json({ message: "Calificacion eliminada exitosamente", data: deletedGrade });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la Calificacion" });
  }
}
