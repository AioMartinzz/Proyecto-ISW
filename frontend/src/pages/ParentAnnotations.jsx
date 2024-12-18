import React, { useEffect, useState } from "react";
import useGetAlumnoIdByApoderado from "../hooks/alumnos/useGetAlumnoIdByApoderado";
import { getAnotaciones } from "../services/anotacion.service";
import "@styles/ParentAnnotations.css";

const ParentAnnotations = () => {
  const { alumnoId, loading: loadingAlumno, error: errorAlumno } = useGetAlumnoIdByApoderado();
  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnotaciones = async () => {
      if (!alumnoId) return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token no encontrado.");
        }

        console.log(`Llamando a la URL: /api/anotaciones/apoderado/${alumnoId}`);
        const response = await getAnotaciones(alumnoId, token);

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : null;

        if (!data) {
          console.error(
            "Se esperaba un arreglo de anotaciones, pero se recibió:",
            response
          );
          throw new Error("Estructura de datos inesperada en la respuesta.");
        }

        console.log("Datos obtenidos:", data);
        setAnotaciones(data);
      } catch (err) {
        console.error("Error al obtener anotaciones:", err);
        setError(err.message || "Error al obtener anotaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnotaciones();
  }, [alumnoId]);

  if (loadingAlumno || loading) {
    return <p>Cargando...</p>;
  }

  if (errorAlumno || error) {
    return <p>Error: {errorAlumno || error}</p>;
  }

  return (
    <div>
      <h1>Anotaciones del Alumno</h1>
      {anotaciones.length === 0 ? (
        <p>No hay anotaciones disponibles.</p>
      ) : (
        <div className="anotaciones-container">
          {anotaciones.map((anotacion) => (
            <div key={anotacion.id} className="anotacion-card">
              <p><strong>Descripción:</strong> {anotacion.descripcion}</p>
              <p><strong>Fecha:</strong> {anotacion.fecha}</p>
              <p><strong>Tipo:</strong> {anotacion.tipo}</p>
              <p><strong>Asignatura:</strong> {anotacion.asignatura?.nombre || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentAnnotations;
