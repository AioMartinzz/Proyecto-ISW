import Alumno from "../entity/alumno.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Curso from "../entity/curso.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createAlumnoService(data) {
  try {
    const { nombreCompleto, rut, fechaNacimiento, apoderadoId, cursoId } = data;
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const apoderadoRepository = AppDataSource.getRepository(Apoderado);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const apoderado = await apoderadoRepository.findOne({ where: { usuarioId: apoderadoId } });
    if (!apoderado) return [null, "El apoderado especificado no existe"];

    const curso = await cursoRepository.findOne({ where: { id: cursoId } });
    if (!curso) return [null, "El curso especificado no existe"];

    const newAlumno = alumnoRepository.create({
      nombreCompleto,
      rut,
      fechaNacimiento,
      apoderado,
      curso,
    });

    const savedAlumno = await alumnoRepository.save(newAlumno);
    return [savedAlumno, null];
  } catch (error) {
    console.error("Error al crear un alumno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAlumnosService() {
  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumnos = await alumnoRepository.find({ relations: ["apoderado", "curso"] });
    return [alumnos, null];
  } catch (error) {
    console.error("Error al obtener los alumnos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateAlumnoService(id, data) {
  try {
    const { nombreCompleto, rut, fechaNacimiento, apoderadoId, cursoId } = data;
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const apoderadoRepository = AppDataSource.getRepository(Apoderado);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const alumno = await alumnoRepository.findOne({ where: { id } });
    if (!alumno) return [null, "Alumno no encontrado"];

    if (apoderadoId) {
      const apoderado = await apoderadoRepository.findOne({ where: { usuarioId: apoderadoId } });
      if (!apoderado) return [null, "El apoderado especificado no existe"];
      alumno.apoderado = apoderado;
    }

    if (cursoId) {
      const curso = await cursoRepository.findOne({ where: { id: cursoId } });
      if (!curso) return [null, "El curso especificado no existe"];
      alumno.curso = curso;
    }

    alumno.nombreCompleto = nombreCompleto || alumno.nombreCompleto;
    alumno.rut = rut || alumno.rut;
    alumno.fechaNacimiento = fechaNacimiento || alumno.fechaNacimiento;

    const updatedAlumno = await alumnoRepository.save(alumno);
    return [updatedAlumno, null];
  } catch (error) {
    console.error("Error al actualizar el alumno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteAlumnoService(id) {
  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumno = await alumnoRepository.findOne({ where: { id } });
    if (!alumno) return [null, "Alumno no encontrado"];

    await alumnoRepository.remove(alumno);
    return [alumno, null];
  } catch (error) {
    console.error("Error al eliminar el alumno:", error);
    return [null, "Error interno del servidor"];
  }
}
