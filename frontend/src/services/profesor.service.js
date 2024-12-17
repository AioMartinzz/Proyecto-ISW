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


// Obtener todos los profesores
export const getProfesores = async () => {
    try {
      const response = await axios.get('/profesores'); // Llama al endpoint del backend
      return response.data; // Retorna los datos de los profesores
    } catch (error) {
      console.error('Error al obtener los profesores:', error.message);
      throw error;
    }
  };