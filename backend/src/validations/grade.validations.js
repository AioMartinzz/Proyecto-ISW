
"use strict";
import { body, validationResult } from "express-validator";

export const validateGrade = [
  body("grade_id").isInt().withMessage("El ID de la calificación debe ser un número entero."),
  body("estudiante_id").isInt().withMessage("El ID del estudiante debe ser un número entero."),
  body("asignatura_id").isInt().withMessage("El ID de la asignatura debe ser un número entero."),
  body("nota").isFloat({ min: 1, max: 7 }).withMessage("La calificación debe estar entre 1 y 7."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

