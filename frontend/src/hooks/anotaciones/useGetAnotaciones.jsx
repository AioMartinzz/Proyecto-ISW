import { useState, useEffect } from 'react';
import { getAnotaciones } from '@services/anotacion.service.js';

const useGetAnotaciones = (alumnoId) => {
    const [anotaciones, setAnotaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnotaciones = async () => {
        if (!alumnoId) {
            console.error('No se proporcionó un ID de alumno.');
            setError('No se puede cargar anotaciones sin un ID de alumno.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getAnotaciones(alumnoId);
            setAnotaciones(data);
        } catch (error) {
            setError('Error al obtener anotaciones.');
            console.error('Error fetching anotaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnotaciones();
    }, [alumnoId]);

    return { anotaciones, loading, error };
};

export default useGetAnotaciones;
