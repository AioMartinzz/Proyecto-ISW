import axios from './root.service.js';

export const getAnotaciones = async (studentId) => {
    try {
        const url = `/anotaciones/apoderado/${studentId}`; // Construye la URL
        console.log(`URL solicitada: ${url}`); // Muestra la URL en la consola
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching anotaciones:', error);
        throw error;
    }
};


export const postAnotacion = async (anotacionData) => {
    try {
        const token = localStorage.getItem('token'); // Obtén el token desde el localStorage
        console.log('Token enviado en la solicitud:', token);

        const response = await axios.post('/anotaciones', anotacionData, {
            headers: {
                Authorization: `Bearer ${token}` // Agrega el token al encabezado
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating anotacion:', error);
        throw error;
    }
};


// Obtener anotaciones creadas (Profesor)
export const getAnotacionesByProfesor = async () => {
    try {
        const response = await axios.get('/anotaciones/profesor');
        return response.data;
    } catch (error) {
        console.error('Error fetching anotaciones for professor:', error);
        throw error;
    }
};

// Modificar una anotación
export const updateAnotacion = async (anotacionId, data) => {
    try {
        const response = await axios.patch(`/anotaciones/${anotacionId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating anotacion:', error);
        throw error;
    }
};

// Eliminar una anotación
export const deleteAnotacion = async (anotacionId) => {
    try {
        const response = await axios.delete(`/anotaciones/${anotacionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting anotacion:', error);
        throw error;
    }
};
