"use strict";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

import {
  createAsistenciaReportService,
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
    const { alumnoId, estado } = req.body;

    const { error } = createAsistenciaValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        error.details[0].message,
      );
    }

    const asistencia = await createAsistenciaService(alumnoId, estado);

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

export async function createAsistenciaReport(req, res) {
  const { alumnoId } = req.params;
  const { mes } = req.body;

  if (!mes) {
    return handleErrorClient(
      res,
      400,
      "Datos inválidos",
      "Debe ingresar un mes",
    );
  }

  if (!alumnoId) {
    return handleErrorClient(
      res,
      400,
      "Datos inválidos",
      "Debe ingresar un alumno",
    );
  }

  if (mes < 1 || mes > 12) {
    return handleErrorClient(
      res,
      400,
      "Datos inválidos",
      "Mes inválido. Debe ser un número entre 1 y 12",
    );
  }

  try {
    const mesReal = mes - 1;
    const [nombreArchivo, pdfBuffer, error] =
      await createAsistenciaReportService(alumnoId, mesReal);

    if (error) {
      return handleErrorServer(res, 500, error.message);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Informe_Asistencia_${nombreArchivo}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Error al generar el informe", error });
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
