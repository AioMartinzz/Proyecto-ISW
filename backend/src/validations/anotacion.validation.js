"use strict";
import Joi from "joi";

// Validación para crear una nueva anotación
export const createAnotacionValidation = Joi.object({
  tipo: Joi.string().valid('Positiva', 'Negativa').required(),
  descripcion: Joi.string().max(255).required(),
  fecha: Joi.date().required(),
  alumnoId: Joi.number().integer().required(),
  profesorId: Joi.number().integer().required(), // Asegúrate de incluir profesorId como permitido
  asignaturaId: Joi.number().integer().required(),
});

// Validación para actualizar una anotación
export const updateAnotacionValidation = Joi.object({
  tipo: Joi.string().valid("Positiva", "Negativa").optional(),
  descripcion: Joi.string().min(5).optional(),
  fecha: Joi.date().optional(),
});
