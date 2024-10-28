"use strict";
import Joi from "joi";

// Validación para crear una nueva asistencia
export const createAsistenciaValidation = Joi.object({
  alumnoId: Joi.number().required(),
});

// Validación para actualizar una asistencia antigua
export const updateAsistenciaValidation = Joi.object({
  estado: Joi.string().valid("Ausente", "Presente").optional(),
});
