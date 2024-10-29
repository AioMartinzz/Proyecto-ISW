"use strict";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

import {
  createAsistenciaService,
  getAsistenciasByAlumnoService,
  getAsistenciasService,
  updateAsistenciaService,
} from "../services/asistencia.service.js";

import {
  createAsistenciaValidation,
  updateAsistenciaValidation,
} from "../validations/asistencia.validation.js";

export async function createAsistencia(req, res) {
  try {
    const profesor_id = req.user;

    const alumnoId = req.body.alumnoId;

    const { error } = createAsistenciaValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        error.details[0].message,
      );
    }

    const asistencia = await createAsistenciaService(alumnoId);

    if (!asistencia) {
      return handleErrorClient(
        res,
        400,
        "Error al crear asistencia",
        "No se pudo crear la asistencia",
      );
    }

    handleSuccess(res, 201, "Asistencia creada con éxito", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAsistencias(req, res) {
  try {
    const asistencias = await getAsistenciasService();

    if (!asistencias) {
      return handleErrorClient(
        res,
        404,
        "No se encontraron asistencias",
        "No se encontraron asistencias para mostrar",
      );
    }

    handleSuccess(res, 200, "Asistencias encontradas", asistencias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAsistenciasByAlumno(req, res) {
  try {
    const id_alumno = req.params.id_alumno;

    const asistencias = await getAsistenciasByAlumnoService(id_alumno);

    if (!asistencias) {
      return handleErrorClient(
        res,
        404,
        "No se encontraron asistencias",
        "No se encontraron asistencias para mostrar",
      );
    }

    handleSuccess(res, 200, "Asistencias encontradas", asistencias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateAsistencia(req, res) {
  try {
    const { id } = req.params;

    const { estado } = req.body;

    const { error } = updateAsistenciaValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        error.details[0].message,
      );
    }

    const asistencia = await updateAsistenciaService(id, estado);

    if (!asistencia) {
      return handleErrorClient(
        res,
        400,
        "Error al actualizar asistencia",
        "No se pudo actualizar la asistencia",
      );
    }

    handleSuccess(res, 200, "Asistencia actualizada con éxito", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
