
"use strict";
import * as gradeService from "../services/grade.service.js";

export async function registerGrade(req, res) {
  const { studentId, subjectId, score } = req.body;
  const [data, error] = await gradeService.registerGradeService({ studentId, subjectId, score });
  if (error) {
    return res.status(400).json({ error });
  }
  return res.status(201).json(data);
}

export async function getGrades(req, res) {
  const { studentId } = req.query;
  const [data, error] = await gradeService.getGradesService(studentId);
  if (error) {
    return res.status(400).json({ error });
  }
  return res.status(200).json(data);
}

