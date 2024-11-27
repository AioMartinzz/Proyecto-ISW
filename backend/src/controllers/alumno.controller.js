import {
  createAlumnoService,
  deleteAlumnoService,
  getAlumnosService,
  updateAlumnoService,
} from "../services/alumno.service.js";

export async function createAlumno(req, res) {
  const [alumno, error] = await createAlumnoService(req.body);
  if (error)
    return res.status(400).json({ status: "Client error", message: error });
  return res.status(201).json({
    status: "Success",
    message: "Alumno creado exitosamente",
    data: alumno,
  });
}

export async function getAlumnos(req, res) {
  const [alumnos, error] = await getAlumnosService();
  if (error)
    return res.status(404).json({ status: "Client error", message: error });
  return res.status(200).json({ status: "Success", data: alumnos });
}

export async function updateAlumno(req, res) {
  const { id } = req.params;
  const [updatedAlumno, error] = await updateAlumnoService(id, req.body);
  if (error)
    return res.status(400).json({ status: "Client error", message: error });
  return res.status(200).json({
    status: "Success",
    message: "Alumno actualizado exitosamente",
    data: updatedAlumno,
  });
}

export async function deleteAlumno(req, res) {
  const { id } = req.params;
  const [deletedAlumno, error] = await deleteAlumnoService(id);
  if (error)
    return res.status(400).json({ status: "Client error", message: error });
  return res.status(200).json({
    status: "Success",
    message: "Alumno eliminado exitosamente",
    data: deletedAlumno,
  });
}
