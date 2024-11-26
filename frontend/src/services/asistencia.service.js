import axios from './root.service.js'

export const getAsistencias = async (cursoId) => {
    const response = await axios.get(`$/asistencias?cursoId=${cursoId}`)
    return response.data
}

export const postAsistencia = async (asistencia) => {
    const response = await axios.post(`/asistencias`, asistencia)
    return response.data
}

export const updateAsistencia = async (id, asistencia) => {
    const response = await axios.put(`$/asistencias/${id}`, asistencia)
    return response.data
}
