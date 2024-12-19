"use strict";
import PDFDocument from "pdfkit-table";
import { Between } from "typeorm";

import { AppDataSource } from "../config/configDb.js";
import AlumnoSchema from "../entity/alumno.entity.js";
import AsistenciaSchema from "../entity/asistencia.entity.js";
import ApoderadoSchema from "../entity/apoderado.entity.js";

import { sendEmailDefault } from "../controllers/email.controller.js";

export async function createAsistenciaService(alumnoId, estado, fecha) {
  try {
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

    const alumno = await alumnoRepository.findOne({ where: { id: alumnoId } });

    if (!alumno) {
      console.error("Alumno no encontrado");
      return null;
    }

    // Obtener fecha actual en la zona horaria de Chile
    const hoy = new Date();
    const fechaChile = new Date(
      hoy.toLocaleString("es-CL", { timeZone: "America/Santiago" }),
    );

    // Calcular el límite de un mes atrás
    const [diaFechaChile, mesFechaChile, anioFechaChile] =
      fechaChile.split("-");

    const limiteMesAnterior = new Date(
      anioFechaChile,
      mesFechaChile - 2,
      diaFechaChile,
    );

    // Convertir la fecha proporcionada a un objeto Date
    const [anioFechaEntrada, mesFechaEntrada, diaFechaEntrada] =
      fecha.split("-");
    const fechaProporcionada = new Date(
      anioFechaEntrada,
      mesFechaEntrada - 1,
      diaFechaEntrada,
    );

    // Validar que la fecha no sea futura ni mayor a un mes de antigüedad
    if (fechaProporcionada > fechaChile) {
      console.error("No se puede crear asistencia para fechas futuras");
      return null;
    }

    if (fechaProporcionada < limiteMesAnterior) {
      console.error(
        "No se puede crear asistencia para fechas mayores a un mes de antigüedad",
      );
      return null;
    }

    // Verificar si ya existe una asistencia para esta fecha y alumno
    const asistencia = await asistenciaRepository.findOne({
      where: { fecha: fecha, alumno: alumno },
    });

    if (asistencia) {
      console.error("Asistencia ya creada para esta fecha");
      return null;
    }

    // Crear y guardar la nueva asistencia
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
    const nombreAlumno = alumno.nombreCompleto;
    const nombreApoderado = apoderado.usuario.nombreCompleto;

    await sendEmailDefault({
      body: {
        email: emailApoderado,
        subject: "Inasistencias",
        message: `Estimado/a ${nombreApoderado}, su pupilo/a ${nombreAlumno} ha acumulado ${inasistenciasMes} 
        inasistencias en el mes actual. Por favor, contacte al colegio para más información.`,
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

export async function getAsistenciasByDateService(fecha) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);

    const asistencias = await asistenciaRepository.find({
      where: { fecha: fecha },
      relations: ["alumno"],
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

  const primerDiaMes = new Date(now.getFullYear(), mes, 1).toLocaleDateString(
    "es-CL",
    {
      timeZone: "America/Santiago",
    },
  );
  const ultimoDiaMes = new Date(
    now.getFullYear(),
    mes + 1,
    0,
  ).toLocaleDateString("es-CL", {
    timeZone: "America/Santiago",
  });

  const mesNombre = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ][mes];

  const asistencias = await asistenciaRepository.find({
    where: {
      alumno: alumno,
      fecha: Between(primerDiaMes, ultimoDiaMes),
    },
  });

  const porcentajeAsistencias = asistencias.filter(
    (asistencia) => asistencia.estado === "Presente",
  ).length;

  const doc = new PDFDocument({ margin: 30 });

  //Reemplazar espacios en blanco con guin bajo
  const nombreArchivo =
    `Informe_Asistencia_${alumno.nombreCompleto}_${mesNombre}.pdf`.replace(
      /\s/g,
      "_",
    );

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

    doc
      .text(`Mes: ${mesNombre}`, { align: "left" })
      .text(
        `Porcentaje de Asistencias: ${((porcentajeAsistencias / asistencias.length) * 100).toFixed(2)}%`,
        { align: "left" },
      )
      .moveDown();

    doc.moveDown();

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

export async function createAsistenciaAutomaticaService() {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciaSchema);
    const alumnoRepository = AppDataSource.getRepository(AlumnoSchema);

    const existeAsistenciaHoy = await asistenciaRepository.findOne({
      where: {
        fecha: new Date().toLocaleDateString("es-CL", {
          timeZone: "America/Santiago",
        }),
      },
    });

    if (existeAsistenciaHoy) {
      console.error("Ya existe asistencia para hoy");
      return;
    }

    const alumnos = await alumnoRepository.find();

    const fecha = new Date().toLocaleDateString("es-CL", {
      timeZone: "America/Santiago",
    });

    console.log("Fecha:", fecha);
    console.log("Alumnos:", alumnos);

    const asistencias = alumnos.map((alumno) => {
      return asistenciaRepository.create({
        fecha: fecha,
        estado: "Presente",
        alumno: alumno,
      });
    });

    await asistenciaRepository.save(asistencias);
    return asistencias;
  } catch (error) {
    console.error("Error al crear asistencias:", error);
    return null;
  }
}
