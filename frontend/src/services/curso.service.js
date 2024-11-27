import axios from './root.service.js'

export const getCursos = async () => {
    const response = await axios.get(`/cursos`)
    console.log('Response Cursos:', response)
    return response.data
}
