"use strict";
import {
  createAnotacionService,
  getAnotacionesByProfesorService,
  updateAnotacionService,
  deleteAnotacionService,
  getAnotacionesByApoderadoService,
  getAnotacionesByAlumnoService,
} from "../services/anotacion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createAnotacionValidation, updateAnotacionValidation } from "../validations/anotacion.validation.js";

// Crear una nueva anotación (solo profesores)
export async function createAnotacion(req, res) {
  try {
    // Validar los datos de entrada
    const { error } = createAnotacionValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Datos inválidos", error.details[0].message);
    }

    const { body } = req;
    const { id: profesorId } = req.user;
    body.profesorId = profesorId;

    const [anotacion, errorService] = await createAnotacionService(body);

    if (errorService) return handleErrorClient(res, 400, "Error al crear anotación", errorService);
    handleSuccess(res, 201, "Anotación creada con éxito", anotacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener anotaciones de un profesor
export async function getAnotacionesByProfesor(req, res) {
  try {
    const { id: profesorId } = req.user;
    const filters = req.query;

    const [anotaciones, error] = await getAnotacionesByProfesorService(profesorId, filters);
    if (error) return handleErrorClient(res, 404, "No se encontraron anotaciones", error);
    handleSuccess(res, 200, "Anotaciones obtenidas con éxito", anotaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Modificar anotación (solo profesores)
export async function updateAnotacion(req, res) {
  try {
    // Validar los datos de entrada
    const { error } = updateAnotacionValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Datos inválidos para la modificación", error.details[0].message);
    }

    const { id: anotacionId } = req.params;
    const { id: profesorId } = req.user;
    const { body } = req;

    const [anotacion, errorService] = await updateAnotacionService(anotacionId, body, profesorId);
    if (errorService) return handleErrorClient(res, 400, "Error al modificar anotación", errorService);
    handleSuccess(res, 200, "Anotación modificada exitosamente", anotacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar anotación (solo profesores)
export async function deleteAnotacion(req, res) {
  try {
    const { id: anotacionId } = req.params;
    const { id: profesorId } = req.user;

    const [anotacion, error] = await deleteAnotacionService(anotacionId, profesorId);
    if (error) return handleErrorClient(res, 400, "Error al eliminar anotación", error);
    handleSuccess(res, 200, "Anotación eliminada con éxito", anotacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener anotaciones para apoderado (ver por alumno)
export async function getAnotacionesByApoderado(req, res) {
  try {
    const { alumnoId } = req.params;

    const [anotaciones, error] = await getAnotacionesByApoderadoService(alumnoId);
    if (error) return handleErrorClient(res, 404, "No se encontraron anotaciones para el alumno", error);
    handleSuccess(res, 200, "Anotaciones obtenidas con éxito", anotaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener resumen de anotaciones para alumnos
export async function getAnotacionesByAlumno(req, res) {
  try {
    const { alumnoId } = req.params;

    const [anotaciones, error] = await getAnotacionesByAlumnoService(alumnoId);
    if (error) return handleErrorClient(res, 404, "No se encontraron anotaciones para el alumno", error);
    handleSuccess(res, 200, "Resumen de anotaciones obtenido con éxito", anotaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
