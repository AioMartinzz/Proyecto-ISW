"use strict";
import Joi from "joi";

// Validación para crear una nueva anotación
export const createAnotacionValidation = Joi.object({
  tipo: Joi.string().valid("Positiva", "Negativa").required(),
  motivo: Joi.string().min(5).required(),
  fecha: Joi.date().required(),
  alumnoId: Joi.number().required(),
  asignaturaId: Joi.number().required(),
});

// Validación para actualizar una anotación
export const updateAnotacionValidation = Joi.object({
  tipo: Joi.string().valid("Positiva", "Negativa").optional(),
  motivo: Joi.string().min(5).optional(),
  fecha: Joi.date().optional(),
});
