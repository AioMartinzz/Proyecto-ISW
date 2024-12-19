"use strict";
import { createGradeService, deleteGradeService, updateGradeService, getGradesService } from "../services/grade.service.js";



// Controlador para crear una calificación
export async function createGrade(req, res) {
  try {
    const { score } = req.body;
    
    // Validación 
    if (score < 1.0 || score > 7.0) {
      return res.status(400).json({
        message: 'La calificación debe estar entre 1.0 y 7.0'
      });
    }

    const [grade, error] = await createGradeService(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    return res.status(201).json(grade);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la calificación'
    });
  }
}

// Controlador para editar una calificacion
export async function updateGrade(req, res) {
  try {
    const { id } = req.params;
    const { estudiante_id, asignatura_id, nota } = req.body;
    
    // Validación 
    if (nota < 1.0 || nota > 7.0) {
      return res.status(400).json({
        message: 'La calificación debe estar entre 1.0 y 7.0'
      });
    }

    const [updatedGrade, error] = await updateGradeService(id, { 
      estudiante_id, 
      asignatura_id, 
      nota 
    });
    
    if (error) return res.status(500).json({ message: error });

    res.status(200).json({ message: "Calificación actualizada exitosamente", data: updatedGrade });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la calificación" });
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
// 
export async function getGrades(req, res) {
  try {
    const user = req.user;
    const grades = await getGradesService(user);
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las calificaciones" });
  }
}

// Agregar método para obtener calificaciones por estudiante
export async function getGradesByStudent(req, res) {
  try {
    const { estudiante_id } = req.params;
    const grades = await getGradesService({ estudiante_id });
    res.status(200).json({ data: grades });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las calificaciones del estudiante" });
  }
} 