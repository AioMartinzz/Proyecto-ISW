import { useState, useEffect } from 'react';
import { getAnotacionesByProfesor } from '@services/anotacion.service.js';

const useGetAnotacionesProfesor = () => {
    const [anotaciones, setAnotaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnotaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAnotacionesByProfesor(); // Llama al servicio para obtener anotaciones
            setAnotaciones(data);
        } catch (err) {
            setError('Error al cargar las anotaciones del profesor.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnotaciones(); // Carga inicial
    }, []);

    return { anotaciones, loading, error, fetchAnotaciones };
};

export default useGetAnotacionesProfesor;
