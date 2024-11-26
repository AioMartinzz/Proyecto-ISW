"use strict";
import { AppDataSource } from "../config/configDb.js";
import Curso from "../entity/curso.entity.js";
import Profesor from "../entity/profesor.entity.js";

// Servicio para crear un curso
export async function createCursoService(nombre, nivel, año, profesorJefeId) {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const profesorRepository = AppDataSource.getRepository(Profesor);

    const profesorJefe = await profesorRepository.findOneBy({
      id: profesorJefeId,
    });
    if (!profesorJefe) {
      return [null, "Profesor Jefe no encontrado"];
    }

    const newCurso = cursoRepository.create({
      nombre,
      nivel,
      año,
      profesorJefe,
    });

    await cursoRepository.save(newCurso);
    return [newCurso, null];
  } catch (error) {
    console.error("Error al intentar crear curso:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getCursosService() {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const cursos = await cursoRepository.findAll();
    return cursos;
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    return [];
  }
}

// Servicio para eliminar un curso por ID
export async function deleteCursoService(id) {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOne({ where: { id } });
    if (!curso) return [null, "Curso no encontrado"];

    await cursoRepository.remove(curso);
    return [curso, null];
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para modificar un curso
export async function updateCursoService(id, data) {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOne({ where: { id } });
    if (!curso) return [null, "Curso no encontrado"];

    const { nombre, nivel, año, profesorJefeId } = data;

    if (profesorJefeId) {
      const profesorRepository = AppDataSource.getRepository(Profesor);
      const profesorJefe = await profesorRepository.findOneBy({
        id: profesorJefeId,
      });
      if (!profesorJefe) return [null, "Profesor Jefe no encontrado"];
      curso.profesorJefe = profesorJefe;
    }

    curso.nombre = nombre || curso.nombre;
    curso.nivel = nivel || curso.nivel;
    curso.año = año || curso.año;

    await cursoRepository.save(curso);
    return [curso, null];
  } catch (error) {
    console.error("Error al modificar el curso:", error);
    return [null, "Error interno del servidor"];
  }
}
