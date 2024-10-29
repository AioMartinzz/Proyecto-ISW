"use strict";
import { AppDataSource } from "../config/configDb.js";
import AlumnoSchema from "../entity/alumno.entity.js";
import AsistenciaSchema from "../entity/asistencia.entity.js";

export async function createAsistenciaService(alumnoId) {
  try {
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

    console.log(alumnoId);
    const alumno = await alumnoRepository.findOne({ where: { id: alumnoId } });

    if (!alumno) {
      console.error("Alumno no encontrado");
      return null;
    }

    const fechaActual = new Date();
    const fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth()}-${fechaActual.getDate()}`;

    const asistencia = await asistenciaRepository.findOne({
      where: { fecha: fecha, alumno: alumno },
    });

    if (asistencia) {
      console.error("Asistencia ya creada");
      return null;
    }

    // Crear la asistencia asegurando que se asocie el objeto alumno correctamente
    const newAsistencia = asistenciaRepository.create({
      fecha: fecha,
      estado: "Presente",
      alumno: alumno, // Debe asociar el objeto completo de alumno, no solo el ID
    });

    await asistenciaRepository.save(newAsistencia);
    return newAsistencia;
  } catch (error) {
    console.error("Error al crear asistencia:", error);
    return null;
  }
}

export async function getAsistenciasService() {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
    const asistencias = await asistenciaRepository.find();
    return asistencias;
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    return null;
  }
}

export async function getAsistenciasByAlumnoService(id_alumno) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);

    const alumno = await alumnoRepository.findOne({ where: { id: id_alumno } });

    console.log(alumno);

    if (!alumno) {
      console.error("Alumno no encontrado");
      return null;
    }

    const asistencias = await asistenciaRepository.findOne({
      where: { alumno: alumno },
    });

    return asistencias;
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    return null;
  }
}

export async function updateAsistenciaService(id, estado) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

    const asistencia = await asistenciaRepository.findOne({
      where: { id: id },
    });

    if (!asistencia) {
      console.error("Asistencia no encontrada");
      return null;
    }

    asistencia.estado = estado;

    await asistenciaRepository.save(asistencia);
    return asistencia;
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    return null;
  }
}
