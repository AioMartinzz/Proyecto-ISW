
"use strict";
import { body, validationResult } from "express-validator";

export const validateGrade = [
  body("studentId").isInt().withMessage("El ID del estudiante debe ser un número entero."),
  body("subjectId").isInt().withMessage("El ID de la asignatura debe ser un número entero."),
  body("score").isFloat({ min: 0, max: 7 }).withMessage("La calificación debe estar entre 0 y 7."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

