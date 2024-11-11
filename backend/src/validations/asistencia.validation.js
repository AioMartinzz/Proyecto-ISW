"use strict";
import Joi from "joi";

// Validación para crear una nueva asistencia
export const createAsistenciaValidation = Joi.object({
  alumnoId: Joi.number().required(),
  estado: Joi.string().valid("Ausente", "Presente").optional(),
  fecha: Joi.date().required(),
});

// Validación para actualizar una asistencia antigua
export const updateAsistenciaValidation = Joi.object({
  estado: Joi.string().valid("Ausente", "Presente").optional(),
});

// Validación para crear un nuevo informe de asistencia
export const createAsistenciaReportValidation = Joi.object({
  alumnoId: Joi.number().required(),
  mes: Joi.number().min(1).max(12).required(),
});
