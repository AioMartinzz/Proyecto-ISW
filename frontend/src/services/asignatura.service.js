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
