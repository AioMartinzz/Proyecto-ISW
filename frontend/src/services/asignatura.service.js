import axios from './root.service.js';

export const getAsignaturaByUsuarioId = async (usuarioId) => {
    try {
        const response = await axios.get(`/asignaturas?usuarioId=${usuarioId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la asignatura:', error.message);
        throw error;
    }
};

export const getAsignaturas = async () => {
    try {
        const response = await axios.get('/asignaturas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las asignaturas:', error.message);
        throw error;
    }
};