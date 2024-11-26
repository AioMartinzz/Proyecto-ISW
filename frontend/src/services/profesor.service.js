import axios from './root.service.js';

// Obtener los datos del usuario que inició sesión
export const getUsuarioActual = async () => {
    try {
        const response = await axios.get(`/user`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario actual:', error.message);
        throw error;
    }
};
