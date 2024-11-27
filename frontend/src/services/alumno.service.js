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

export const postAsistencia = async (asistencias) => {
    const response = await axios.post(`/asistencias`, { asistencias })
    return response.data
}
