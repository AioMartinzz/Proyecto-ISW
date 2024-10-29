"use strict";
import { AppDataSource } from "../config/configDb.js";
import Anotacion from "../entity/anotacion.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Profesor from "../entity/profesor.entity.js";
import Asignatura from "../entity/asignatura.entity.js";

// Crear una nueva anotación (solo profesores)
export async function createAnotacionService(data) {
  const { tipo, descripcion, fecha, alumnoId, profesorId, asignaturaId } = data;
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);

    // Verificar si el alumno, profesor y asignatura existen
    const alumno = await alumnoRepository.findOne({ where: { id: alumnoId } });
    const profesor = await profesorRepository.findOne({ where: { usuarioId: profesorId } }); // Cambiado a usuarioId
    const asignatura = await asignaturaRepository.findOne({ where: { id: asignaturaId } });

    if (!alumno || !profesor || !asignatura) {
      return [null, "Alumno, profesor o asignatura no encontrados"];
    }

    // Crear la nueva anotación
    const newAnotacion = anotacionRepository.create({
      tipo,
      descripcion,
      fecha,
      alumno,
      profesor,
      asignatura,
    });

    await anotacionRepository.save(newAnotacion);
    return [newAnotacion, null];
  } catch (error) {
    console.error("Error al crear anotación:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener anotaciones de un profesor
export async function getAnotacionesByProfesorService(profesorId, filters) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);
    const anotaciones = await anotacionRepository.find({
      where: { profesor: { usuarioId: profesorId } },
      relations: ["asignatura", "alumno"],
    });
    return [anotaciones, null];
  } catch (error) {
    console.error("Error al obtener anotaciones del profesor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Modificar una anotación existente (solo profesores)
export async function updateAnotacionService(anotacionId, data) {
  const { tipo, descripcion, fecha } = data;
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotacion = await anotacionRepository.findOne({ where: { id: anotacionId } });
    if (!anotacion) return [null, "Anotación no encontrada"];

    anotacion.tipo = tipo || anotacion.tipo;
    anotacion.descripcion = descripcion || anotacion.descripcion;
    anotacion.fecha = fecha || anotacion.fecha;

    await anotacionRepository.save(anotacion);
    return [anotacion, null];
  } catch (error) {
    console.error("Error al modificar anotación:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar una anotación existente (solo profesores)
export async function deleteAnotacionService(anotacionId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotacion = await anotacionRepository.findOne({ where: { id: anotacionId } });
    if (!anotacion) return [null, "Anotación no encontrada"];

    await anotacionRepository.remove(anotacion);
    return ["Anotación eliminada exitosamente", null];
  } catch (error) {
    console.error("Error al eliminar anotación:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener anotaciones para apoderado (ver por alumno)
export async function getAnotacionesPorAlumnoService(alumnoId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotaciones = await anotacionRepository.find({
      where: { alumno: { id: alumnoId } },
      relations: ["asignatura", "profesor"],
    });

    if (!anotaciones || anotaciones.length === 0) return [null, "No se encontraron anotaciones para el alumno"];
    return [anotaciones, null];
  } catch (error) {
    console.error("Error al obtener anotaciones para el alumno:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener resumen de anotaciones para alumnos (cantidad por asignatura)
export async function getResumenAnotacionesPorAsignaturaService(alumnoId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const resumen = await anotacionRepository
      .createQueryBuilder("anotacion")
      .select("anotacion.asignaturaId", "asignaturaId")
      .addSelect("COUNT(anotacion.id)", "cantidad")
      .where("anotacion.alumnoId = :alumnoId", { alumnoId })
      .groupBy("anotacion.asignaturaId")
      .getRawMany();

    return [resumen, null];
  } catch (error) {
    console.error("Error al obtener resumen de anotaciones:", error);
    return [null, "Error interno del servidor"];
  }
}
