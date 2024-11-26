import axios from './root.service.js'

export const getAlumnos = async () => {
    const response = await axios.get(`/alumnos`)
    return response.data
}

export const postAsistencia = async (asistencias) => {
    const response = await axios.post(`/asistencias`, { asistencias })
    return response.data
}
