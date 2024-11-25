"use strict";
import {
  createCursoService,
  deleteCursoService,
  getCursosService,
  updateCursoService,
} from "../services/curso.service.js";

// Controlador para crear un curso
export async function createCurso(req, res) {
  try {
    const { nombre, nivel, año, profesorJefeId } = req.body;

    const [curso, error] = await createCursoService(
      nombre,
      nivel,
      año,
      profesorJefeId,
    );
    if (error) return res.status(400).json({ message: error });

    res.status(201).json({ message: "Curso creado exitosamente", data: curso });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el curso" });
  }
}

export async function getCursos(req, res) {
  try {
    const cursos = await getCursosService();
    res.status(200).json({ data: cursos });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cursos" });
  }
}

// Controlador para eliminar un curso
export async function deleteCurso(req, res) {
  try {
    const { id } = req.params;

    const [curso, error] = await deleteCursoService(id);
    if (error) return res.status(404).json({ message: error });

    res
      .status(200)
      .json({ message: "Curso eliminado exitosamente", data: curso });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso" });
  }
}

// Controlador para modificar un curso
export async function updateCurso(req, res) {
  try {
    const { id } = req.params;
    const { nombre, nivel, año, profesorJefeId } = req.body;

    const [curso, error] = await updateCursoService(id, {
      nombre,
      nivel,
      año,
      profesorJefeId,
    });
    if (error) return res.status(404).json({ message: error });

    res
      .status(200)
      .json({ message: "Curso modificado exitosamente", data: curso });
  } catch (error) {
    res.status(500).json({ message: "Error al modificar el curso" });
  }
}
