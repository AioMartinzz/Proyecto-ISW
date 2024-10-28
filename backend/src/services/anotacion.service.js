"use strict";
import Anotacion from "../entity/anotacion.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Profesor from "../entity/profesor.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Crear una nueva anotación (solo profesores)
export async function createAnotacionService(data) {
  const { tipo, motivo, fecha, alumnoId, profesorId, asignaturaId } = data;
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);

    // Verificar si el alumno, profesor y asignatura existen
    const alumno = await alumnoRepository.findOne({ where: { id: alumnoId } });
    const profesor = await profesorRepository.findOne({ where: { id: profesorId } });
    const asignatura = await asignaturaRepository.findOne({ where: { id: asignaturaId } });

    if (!alumno || !profesor || !asignatura) {
      return [null, "Alumno, profesor o asignatura no encontrados"];
    }

    // Crear la nueva anotación
    const newAnotacion = anotacionRepository.create({
      tipo,
      motivo,
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

// Obtener anotaciones creadas por un profesor (filtros: por curso, alumno, fecha)
export async function getAnotacionesByProfesorService(profesorId, filters) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);
    const queryBuilder = anotacionRepository.createQueryBuilder("anotacion")
      .leftJoinAndSelect("anotacion.alumno", "alumno")
      .leftJoinAndSelect("anotacion.asignatura", "asignatura")
      .where("anotacion.profesorId = :profesorId", { profesorId });

    if (filters.alumnoId) {
      queryBuilder.andWhere("anotacion.alumnoId = :alumnoId", { alumnoId: filters.alumnoId });
    }

    if (filters.fecha) {
      queryBuilder.andWhere("anotacion.fecha = :fecha", { fecha: filters.fecha });
    }

    const anotaciones = await queryBuilder.getMany();
    return [anotaciones, null];
  } catch (error) {
    console.error("Error al obtener anotaciones por profesor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Modificar una anotación existente (solo profesores)
export async function updateAnotacionService(anotacionId, data, profesorId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotacion = await anotacionRepository.findOne({ where: { id: anotacionId, profesorId } });
    if (!anotacion) return [null, "Anotación no encontrada o no tiene permisos para modificarla"];

    Object.assign(anotacion, data);
    await anotacionRepository.save(anotacion);

    return [anotacion, null];
  } catch (error) {
    console.error("Error al modificar anotación:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar una anotación existente (solo profesores)
export async function deleteAnotacionService(anotacionId, profesorId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotacion = await anotacionRepository.findOne({ where: { id: anotacionId, profesorId } });
    if (!anotacion) return [null, "Anotación no encontrada o no tiene permisos para eliminarla"];

    await anotacionRepository.remove(anotacion);
    return [anotacion, null];
  } catch (error) {
    console.error("Error al eliminar anotación:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener anotaciones para apoderado (ver por alumno)
export async function getAnotacionesByApoderadoService(alumnoId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotaciones = await anotacionRepository.find({
      where: { alumno: { id: alumnoId } },
      relations: ["asignatura"],
    });

    return [anotaciones, null];
  } catch (error) {
    console.error("Error al obtener anotaciones para apoderado:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener resumen de anotaciones para alumnos (cantidad por asignatura)
export async function getAnotacionesByAlumnoService(alumnoId) {
  try {
    const anotacionRepository = AppDataSource.getRepository(Anotacion);

    const anotaciones = await anotacionRepository.createQueryBuilder("anotacion")
      .select("anotacion.asignaturaId, anotacion.tipo, COUNT(*) as cantidad")
      .where("anotacion.alumnoId = :alumnoId", { alumnoId })
      .groupBy("anotacion.asignaturaId, anotacion.tipo")
      .getRawMany();

    return [anotaciones, null];
  } catch (error) {
    console.error("Error al obtener resumen de anotaciones para alumno:", error);
    return [null, "Error interno del servidor"];
  }
}
