"use strict";
import { AppDataSource } from "../config/configDb.js";
import Grade from "../entity/grade.entity.js";


// Servicio para crear una nueva nota
export async function createGradeService(data) {
  try {
    const GradeRepository = AppDataSource.getRepository(Grade);
    const newGrade = GradeRepository.create(data);
    await GradeRepository.save(newGrade);
    return [newGrade, null];
  } catch (error) {
    console.error("Error al crear la Grade:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar una nota
export async function updateGradeService(id, data) {
  try {
    const GradeRepository = AppDataSource.getRepository(Grade);
    const grade = await GradeRepository.findOne({ where: { grade_id: id } });
    if (!grade) return [null, "Calificacion no encontrada"];

    GradeRepository.merge(grade, data);
    const updatedGrade = await GradeRepository.save(grade);
    return [updatedGrade, null];
  } catch (error) {
    console.error("Error al actualizar la Grade:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar una nota
export async function deleteGradeService(id) {
  try {
    const GradeRepository = AppDataSource.getRepository(Grade);
    const grade = await GradeRepository.findOneBy({ grade_id: id });
    
    if (!grade) {
      return [null, "Calificación no encontrada"];
    }

    const result = await GradeRepository.delete({ grade_id: id });
    
    if (result.affected > 0) {
      return [grade, null];
    } else {
      return [null, "No se pudo eliminar la calificación"];
    }
  } catch (error) {
    console.error("Error al eliminar la calificación:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todas las notas con filtros según el usuario
export async function getGradesService(user) {
  try {
    const gradeRepository = AppDataSource.getRepository(Grade);

    // joins
    let query = gradeRepository
      .createQueryBuilder("grade")
      .leftJoin("Alumno", "alumno", "grade.estudiante_id = alumno.id")
      .leftJoin("Asignatura", "asignatura", "grade.asignatura_id = asignatura.id")
      .select([
        "grade.grade_id AS grade_id",
        "grade.nota AS nota",
        "alumno.nombreCompleto AS nombre_estudiante",
        "asignatura.nombre AS nombre_asignatura",
        "grade.fechacreacion AS fechacreacion"
      ]);

    // caso profesor
    if (user.rol?.toLowerCase() === 'profesor') {
      query = query
        .leftJoin("Profesor", "profesor", "profesor.usuarioId = :userId", { userId: user.id })
        .andWhere("grade.asignatura_id = profesor.asignaturaId");
    } else if (user.rol?.toLowerCase() === 'apoderado') {
      // caso apoderado
      query = query
        .leftJoin("Apoderado", "apoderado", "apoderado.usuarioId = :userId", { userId: user.id })
        .leftJoin("Alumno", "alumno_apoderado", "alumno_apoderado.apoderadoUsuarioId = apoderado.usuarioId")
        .andWhere("grade.estudiante_id = alumno_apoderado.id");
    }

    const grades = await query.getRawMany();

    console.log('Grades from DB:', grades);

    const formattedGrades = grades.map(grade => ({
      ...grade,
      nota: grade.nota || 0,
    }));

    if (!grades || grades.length === 0) return [null, "No hay calificaciones"];
    return [formattedGrades, null];
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    return [null, "Error interno del servidor"];
  }
}
