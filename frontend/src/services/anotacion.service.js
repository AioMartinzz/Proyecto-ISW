import axios from './root.service.js';

export const getAnotaciones = async (studentId) => {
    try {
        const response = await axios.get(`/anotaciones/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching anotaciones:', error);
        throw error;
    }
};

export const postAnotacion = async (anotacionData) => {
    try {
        const response = await axios.post('/anotaciones', anotacionData);
        return response.data;
    } catch (error) {
        console.error('Error creating anotacion:', error);
        throw error;
    }
};


