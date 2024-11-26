"use strict";
import { createAsignaturaService, deleteAsignaturaService, updateAsignaturaService } from "../services/asignatura.service.js";

// Controlador para crear una asignatura
export async function createAsignatura(req, res) {
  try {
    const { nombre } = req.body;
    const [newAsignatura, error] = await createAsignaturaService({ nombre });
    if (error) return res.status(500).json({ message: error });

    res.status(201).json({ message: "Asignatura creada exitosamente", data: newAsignatura });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la asignatura" });
  }
}

// Controlador para editar una asignatura
export async function updateAsignatura(req, res) {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const [updatedAsignatura, error] = await updateAsignaturaService(id, { nombre });
    if (error) return res.status(500).json({ message: error });

    res.status(200).json({ message: "Asignatura actualizada exitosamente", data: updatedAsignatura });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la asignatura" });
  }
}

// Controlador para eliminar una asignatura
export async function deleteAsignatura(req, res) {
  try {
    const { id } = req.params;
    const [deletedAsignatura, error] = await deleteAsignaturaService(id);
    if (error) return res.status(500).json({ message: error });

    res.status(200).json({ message: "Asignatura eliminada exitosamente", data: deletedAsignatura });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la asignatura" });
  }
}

export async function getAllAsignaturas(req, res) {
  try {
    const asignaturas = await getAllAsignaturasService();
    res.status(200).json(asignaturas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las asignaturas" });
  }
}