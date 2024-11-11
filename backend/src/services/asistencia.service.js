"use strict";
import PDFDocument from "pdfkit-table";
import { Between } from "typeorm";

import { AppDataSource } from "../config/configDb.js";
import AlumnoSchema from "../entity/alumno.entity.js";
import AsistenciaSchema from "../entity/asistencia.entity.js";
import ApoderadoSchema from "../entity/apoderado.entity.js";

import { sendEmailDefault } from "../controllers/email.controller.js";

export async function createAsistenciaService(alumnoId, estado) {
  try {
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

    const alumno = await alumnoRepository.findOne({ where: { id: alumnoId } });

    if (!alumno) {
      console.error("Alumno no encontrado");
      return null;
    }

    const fechaActual = new Date();
    const fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`;

    const asistencia = await asistenciaRepository.findOne({
      where: { fecha: fecha, alumno: alumno },
    });

    if (asistencia) {
      console.error("Asistencia ya creada para hoy");
      return null;
    }

    const newAsistencia = asistenciaRepository.create({
      fecha: fecha,
      estado: estado,
      alumno: alumno,
    });

    await asistenciaRepository.save(newAsistencia);

    if (estado === "Ausente") {
      await verificarInasistenciasService(alumnoId);
    }
    return newAsistencia;
  } catch (error) {
    console.error("Error al crear asistencia:", error);
    return null;
  }
}

export async function verificarInasistenciasService(alumnoId) {
  const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

  // Contar inasistencias en el mes actual
  const inasistenciasMes = await asistenciaRepository
    .createQueryBuilder("asistencia")
    .where("asistencia.alumno.id = :alumnoId", { alumnoId })
    .andWhere("asistencia.estado = :estado", { estado: "Ausente" })
    .andWhere(
      "EXTRACT(MONTH FROM asistencia.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)",
    )
    .andWhere(
      "EXTRACT(YEAR FROM asistencia.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)",
    )
    .getCount();

  if (inasistenciasMes >= 5) {
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);
    const apoderadoRepository = AppDataSource.getRepository(ApoderadoSchema);

    const alumno = await alumnoRepository.findOne({
      where: { id: alumnoId },
      relations: ["apoderado"],
    });

    const apoderado = await apoderadoRepository.findOne({
      where: { id: alumno.apoderado.id },
      relations: ["usuario"],
    });

    const emailApoderado = apoderado.usuario.email;

    const resEmail = await sendEmailDefault({
      body: {
        email: emailApoderado,
        subject: "Inasistencias",
        message:
          "Su pupilo ha acumulado 5 inasistencias en el mes actual. Por favor, contacte al liceo para más información.",
      },
    });
  }
}

export async function getAsistenciasService() {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
    const asistencias = await asistenciaRepository.find();
    return asistencias;
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    return null;
  }
}

export async function getAsistenciasByAlumnoService(id_alumno) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);

    const alumno = await alumnoRepository.findOne({
      where: { id: id_alumno },
      relations: ["curso"],
    });

    if (!alumno) {
      console.error("Alumno no encontrado");
      return null;
    }

    const asistencias = await asistenciaRepository.findOne({
      where: { alumno: alumno },
    });

    return asistencias;
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    return null;
  }
}

export async function createAsistenciaReportService(alumnoId, mes, res) {
  const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
  const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);

  const alumno = await alumnoRepository.findOne({
    where: { id: alumnoId },
    relations: ["curso"],
  });

  if (!alumno) {
    console.error("Alumno no encontrado");
    return [null, error];
  }

  // Obtener el primer y último día del mes seleccionado del año actual
  const now = new Date();
  const primerDiaMes = new Date(now.getFullYear(), mes, 1);
  const ultimoDiaMes = new Date(now.getFullYear(), mes + 1, 0);

  console.log(
    "mes: ",
    mes,
    "primerdia: ",
    primerDiaMes,
    "ultimodia: ",
    ultimoDiaMes,
  );

  const asistencias = await asistenciaRepository.find({
    where: {
      alumno: alumno,
      fecha: Between(primerDiaMes, ultimoDiaMes),
    },
  });

  const doc = new PDFDocument({ margin: 30 });

  const nombreArchivo = `Informe_Asistencia_${alumno.nombreCompleto}.pdf`;

  const pdfBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    doc.on("data", (buffer) => buffers.push(buffer));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Agregar título e información del alumno
    doc
      .fontSize(20)
      .text("Informe de Asistencia", { align: "center" })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Alumno: ${alumno.nombreCompleto}`, { align: "left" })
      .text(`Curso: ${alumno.curso.nombre}`, { align: "left" })
      .text(`Fecha de Nacimiento: ${alumno.fechaNacimiento}`, { align: "left" })
      .moveDown();

    // Crear encabezados y filas como arrays de arrays
    const table = {
      headers: ["Fecha", "Estado"],
      rows: asistencias.map((asistencia) => [
        asistencia.fecha,
        asistencia.estado,
      ]),
    };

    // Crear la tabla
    doc.table(table, { startU: 50, startV: 150, margin: 30 });

    // Finalizar
    doc.end();
  });

  return [nombreArchivo, pdfBuffer, null];
}

export async function updateAsistenciaService(id, estado) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

    const asistencia = await asistenciaRepository.findOne({
      where: { id: id },
    });

    if (!asistencia) {
      console.error("Asistencia no encontrada");
      return null;
    }

    asistencia.estado = estado;

    await asistenciaRepository.save(asistencia);
    return asistencia;
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    return null;
  }
}
