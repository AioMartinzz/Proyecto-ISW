"use strict";
import Joi from "joi";

const todayOrFuture = (value, helpers) => {
  const currentDate = new Date();
  const inputDate = new Date(value);

  inputDate.setDate(inputDate.getDate() + 1);

  const currentDateLocal = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const inputDateLocal = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

  console.log("Fecha actual (ajustada a medianoche, local):", currentDateLocal);
  console.log("Fecha ingresada después de ajustar (+1 día, ajustada a medianoche, local):", inputDateLocal);

  if (inputDateLocal.getTime() < currentDateLocal.getTime()) {
    console.log("Error: La fecha ingresada sigue siendo menor que la fecha actual.");
    return helpers.error("any.invalid", { message: "La fecha debe ser igual o posterior a la actual" });
  }

  console.log("Validación exitosa para la fecha ingresada:", inputDateLocal);
  return value;
};

// Validación para crear una nueva anotación
export const createAnotacionValidation = Joi.object({
  tipo: Joi.string().valid('Positiva', 'Negativa').required(),
  descripcion: Joi.string().max(255).required(),
  fecha: Joi.date().iso().required().custom(todayOrFuture, "validación de fecha personalizada"), // Validación personalizada
  alumnoId: Joi.number().integer().required(),
  profesorId: Joi.number().integer().required(),
  asignaturaId: Joi.number().integer().required(),
});

// Validación para actualizar una anotación
export const updateAnotacionValidation = Joi.object({
  tipo: Joi.string().valid("Positiva", "Negativa").optional(),
  descripcion: Joi.string().min(5).optional(),
  fecha: Joi.date().iso().optional(), // Aseguramos formato ISO
});
