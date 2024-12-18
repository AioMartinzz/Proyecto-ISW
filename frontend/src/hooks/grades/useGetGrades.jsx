import { useState, useEffect } from 'react';
import { getGradesService } from '../../services/grade.service';

const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getGradesService();

        // Manejo de diferentes estructuras de respuesta en caso de error de formato
        if (response && Array.isArray(response)) {
          // Caso Estructura del servidor
          if (response[0]?.data && Array.isArray(response[0].data)) {
            setGrades(response[0].data);
          }
          // Caso Estructura local
          else if (response[0] && Array.isArray(response[0][0])) {
            setGrades(response[0][0]);
          } 
          else {
            throw new Error('La estructura de los datos no es la esperada.');
          }
        } else {
          throw new Error('La respuesta no es un array.');
        }
      } catch (err) {
        console.error('Error al obtener las calificaciones:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return { grades, setGrades, loading, error };
};

export default useGrades;
