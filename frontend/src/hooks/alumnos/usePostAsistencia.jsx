import { postAsistencia } from '@services/alumno.service'

const usePostAsistencia = (fetchAlumnos) => {
    const handlePostAsistencia = async (asistencias) => {
        try {
            await postAsistencia(asistencias)
            fetchAlumnos()
        } catch (error) {
            console.error('Error posting asistencias:', error)
        }
    }

    return { handlePostAsistencia }
}

export default usePostAsistencia
