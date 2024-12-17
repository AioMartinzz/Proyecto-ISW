import axios from './root.service.js';

export const getAlumnos = async () => {
    try {
        const response = await axios.get('/alumnos'); // Endpoint correcto
        return response.data.data || []; // Devuelve los datos de los alumnos
    } catch (error) {
        console.error('Error al obtener alumnos:', error.response?.data?.message || error.message);
        throw error;
    }
};




export const postAsistencia = async (asistencias) => {
    const response = await axios.post(`/asistencias`, { asistencias })
    return response.data
}

export const getAlumnosByApoderado = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/alumnos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data.filter((alumno) => alumno.apoderado === jwtDecode(token).id);
    } catch (error) {
        console.error('Error fetching alumnos for apoderado:', error);
        throw error;
    }
};
