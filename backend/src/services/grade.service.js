
"use strict";
import Grade from "../entity/grade.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function registerGradeService({ studentId, subjectId, score }) {
  try {
    const gradeRepository = AppDataSource.getRepository(Grade);
    const newGrade = gradeRepository.create({ studentId, subjectId, score });
    await gradeRepository.save(newGrade);
    return [newGrade, null];
  } catch (error) {
    console.error("Error al registrar la calificación:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getGradesService(studentId) {
  try {
    const gradeRepository = AppDataSource.getRepository(Grade);
    const grades = await gradeRepository.find({ where: { studentId } });
    return [grades, null];
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    return [null, "Error interno del servidor"];
  }
}

