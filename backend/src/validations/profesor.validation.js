"use strict";
import Joi from "joi";

export const profesorBodyValidation = Joi.object({
  usuarioId: Joi.number().integer().required().messages({
    "number.base": "El usuarioId debe ser un número.",
    "any.required": "El usuarioId es obligatorio.",
  }),
  asignaturaId: Joi.number().integer().required().messages({
    "number.base": "El asignaturaId debe ser un número.",
    "any.required": "El asignaturaId es obligatorio.",
  }),
});

export const profesorQueryValidation = Joi.object({
  id: Joi.number().integer(),
  usuarioId: Joi.number().integer(),
}).or("id", "usuarioId").messages({
  "any.required": "Debe proporcionar al menos id o usuarioId para la consulta.",
});
