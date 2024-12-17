"use strict";
import {
  createProfesorService,
  deleteProfesorService,
  getProfesorService,
  getProfesoresService,
  updateProfesorService,
} from "../services/profesor.service.js";

import {
  profesorBodyValidation,
  profesorQueryValidation,
} from "../validations/profesor.validation.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Obtener un profesor por ID o usuarioId
export async function getProfesor(req, res) {
  try {
    const { id, usuarioId } = req.query;
    const { error } = profesorQueryValidation.validate({ id, usuarioId });

    if (error) return handleErrorClient(res, 400, error.message);

    const [profesor, errorProfesor] = await getProfesorService({ id, usuarioId });
    if (errorProfesor) return handleErrorClient(res, 404, errorProfesor);

    handleSuccess(res, 200, "Profesor encontrado", profesor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los profesores
export async function getProfesores(req, res) {
  try {
    const [profesores, errorProfesores] = await getProfesoresService();

    if (errorProfesores) return handleErrorClient(res, 404, errorProfesores);

    profesores.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Profesores encontrados", profesores);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Crear un profesor
export async function createProfesor(req, res) {
  try {
    const { body } = req;

    const { error } = profesorBodyValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [newProfesor, errorNewProfesor] = await createProfesorService(body);

    if (errorNewProfesor)
      return handleErrorClient(res, 400, errorNewProfesor);

    handleSuccess(res, 201, "Profesor creado exitosamente", newProfesor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Modificar un profesor existente
export async function updateProfesor(req, res) {
  try {
    const { id, usuarioId } = req.query;
    const { body } = req;

    const { error: queryError } = profesorQueryValidation.validate({ id, usuarioId });
    if (queryError)
      return handleErrorClient(res, 400, queryError.message);

    const { error: bodyError } = profesorBodyValidation.validate(body);
    if (bodyError)
      return handleErrorClient(res, 400, bodyError.message);

    const [profesor, errorProfesor] = await updateProfesorService({ id, usuarioId }, body);

    if (errorProfesor)
      return handleErrorClient(res, 400, errorProfesor);

    handleSuccess(res, 200, "Profesor modificado correctamente", profesor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un profesor
export async function deleteProfesor(req, res) {
  try {
    const { id, usuarioId } = req.query;

    const { error } = profesorQueryValidation.validate({ id, usuarioId });
    if (error)
      return handleErrorClient(res, 400, error.message);

    const [profesorDeleted, errorProfesorDeleted] = await deleteProfesorService({ id, usuarioId });

    if (errorProfesorDeleted)
      return handleErrorClient(res, 404, errorProfesorDeleted);

    handleSuccess(res, 200, "Profesor eliminado correctamente", profesorDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
