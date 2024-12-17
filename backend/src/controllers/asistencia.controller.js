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
  getAsistenciasByDateService,
  getAsistenciasService,
  updateAsistenciaService,
} from "../services/asistencia.service.js";

import {
  createAsistenciaReportValidation,
  createAsistenciaValidation,
  getAsistenciasByDateValidation,
  updateAsistenciaValidation,
} from "../validations/asistencia.validation.js";

export async function createAsistencia(req, res) {
  try {
    const { alumnoId, estado, fecha } = req.body;

    const { error } = createAsistenciaValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        error.details[0].message,
      );
    }

    const asistencia = await createAsistenciaService(alumnoId, estado, fecha);

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
      return { asistencias: [] };
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

export async function getAsistenciasByDate(req, res) {
  try {
    const { fecha } = req.body;

    const { error } = getAsistenciasByDateValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        error.details[0].message,
      );
    }

    const asistencias = await getAsistenciasByDateService(fecha);

    if (!asistencias || asistencias.length === 0) {
      [];
    }

    handleSuccess(res, 200, "Asistencias encontradas", asistencias);
  } catch (error) {
    console.error("Error en getAsistenciasByDate:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function createAsistenciaReport(req, res) {
  try {
    const { alumnoId, mes } = req.body;

    const { errorValidation } = createAsistenciaReportValidation.validate(
      req.body,
    );

    if (errorValidation) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        errorValidation.details[0].message,
      );
    }

    const mesReal = mes - 1;
    const [nombreArchivo, pdfBuffer, error] =
      await createAsistenciaReportService(alumnoId, mesReal);

    if (error) {
      return handleErrorServer(res, 500, error.message);
    }

    // Configurar encabezados
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Informe_Asistencia_${nombreArchivo}.pdf`,
    );

    // Enviar el buffer
    res.status(200).send(pdfBuffer);
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
