import { useState } from 'react';
import { getAnotaciones } from '@services/anotacion.service.js';

const useGetAnotaciones = () => {
    const [anotaciones, setAnotaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnotaciones = async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAnotaciones(studentId);
            setAnotaciones(data);
        } catch (error) {
            setError('Error al obtener anotaciones.');
            console.error('Error fetching anotaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    return { anotaciones, loading, error, fetchAnotaciones };
};

export default useGetAnotaciones;

