import { useState, useEffect } from 'react';
import { getGradesService } from '../../services/grade.service';

const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      const data = await getGradesService();
      console.log('Datos recibidos:', data);
      setGrades(data);
      setLoading(false);
    };

    fetchGrades();
  }, []);

  return { grades, setGrades, loading };
};

export default useGrades; 