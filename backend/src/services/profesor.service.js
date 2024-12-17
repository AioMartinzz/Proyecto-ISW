"use strict";
import Profesor from "../entity/profesor.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Obtener un profesor por ID o usuarioId
export async function getProfesorService(query) {
  try {
    const { id, usuarioId } = query;
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({ where: [{ id }, { usuarioId }] });

    if (!profesor) return [null, "Profesor no encontrado"];
    return [profesor, null];
  } catch (error) {
    console.error("Error al obtener el profesor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los profesores
export async function getProfesoresService() {
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesores = await profesorRepository.find();
    if (!profesores || profesores.length === 0) return [null, "No hay profesores"];
    return [profesores, null];
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    return [null, "Error interno del servidor"];
  }
}

// Crear un profesor
export async function createProfesorService(data) {
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const newProfesor = profesorRepository.create(data);
    const savedProfesor = await profesorRepository.save(newProfesor);
    return [savedProfesor, null];
  } catch (error) {
    console.error("Error al crear el profesor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Modificar un profesor existente
export async function updateProfesorService(query, data) {
  try {
    const { id, usuarioId } = query;
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({ where: [{ id }, { usuarioId }] });

    if (!profesor) return [null, "Profesor no encontrado"];

    const updatedProfesor = await profesorRepository.save({ ...profesor, ...data });
    return [updatedProfesor, null];
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un profesor
export async function deleteProfesorService(query) {
  try {
    const { id, usuarioId } = query;
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({ where: [{ id }, { usuarioId }] });

    if (!profesor) return [null, "Profesor no encontrado"];

    const deletedProfesor = await profesorRepository.remove(profesor);
    return [deletedProfesor, null];
  } catch (error) {
    console.error("Error al eliminar el profesor:", error);
    return [null, "Error interno del servidor"];
  }
}
