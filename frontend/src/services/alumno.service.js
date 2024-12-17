import axios from './root.service.js'

export const getAlumnos = async () => {
    try {
        const response = await axios.get('/alumnos')
        return response.data.data || []
    } catch (error) {
        console.error(
            'Error al obtener alumnos:',
            error.response?.data?.message || error.message
        )
        throw error
    }
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
