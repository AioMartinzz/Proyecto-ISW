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
        console.log('Datos recibidos:', response);

        // Verificar la estructura del JSON recibido
        if (response && Array.isArray(response) && response[0]?.data) {
          // Extraer calificaciones del primer índice y asegurar que sea un array plano
          const extractedGrades = response[0].data?.[0] || [];
          if (Array.isArray(extractedGrades)) {
            setGrades(extractedGrades);
          } else {
            throw new Error('Los datos de calificaciones no tienen la estructura esperada.');
          }
        } else {
          throw new Error('La estructura de los datos no es la esperada.');
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
