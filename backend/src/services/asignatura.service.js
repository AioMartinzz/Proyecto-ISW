"use strict";
import { AppDataSource } from "../config/configDb.js";
import Asignatura from "../entity/asignatura.entity.js";

// Servicio para crear una nueva asignatura
export async function createAsignaturaService(data) {
  try {
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);
    const newAsignatura = asignaturaRepository.create(data);
    await asignaturaRepository.save(newAsignatura);
    return [newAsignatura, null];
  } catch (error) {
    console.error("Error al crear la asignatura:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar una asignatura
export async function updateAsignaturaService(id, data) {
  try {
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);
    const asignatura = await asignaturaRepository.findOne({ where: { id } });
    if (!asignatura) return [null, "Asignatura no encontrada"];

    asignaturaRepository.merge(asignatura, data);
    const updatedAsignatura = await asignaturaRepository.save(asignatura);
    return [updatedAsignatura, null];
  } catch (error) {
    console.error("Error al actualizar la asignatura:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar una asignatura
export async function deleteAsignaturaService(id) {
  try {
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);
    const asignatura = await asignaturaRepository.findOne({ where: { id } });
    if (!asignatura) return [null, "Asignatura no encontrada"];

    await asignaturaRepository.remove(asignatura);
    return [asignatura, null];
  } catch (error) {
    console.error("Error al eliminar la asignatura:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllAsignaturasService() {
  try {
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);
    const asignaturas = await asignaturaRepository.find(); // Obtiene todas las asignaturas
    return asignaturas;
  } catch (error) {
    console.error("Error al obtener las asignaturas:", error);
    throw new Error("Error interno del servidor");
  }
}