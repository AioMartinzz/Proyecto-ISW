import { postAsistencia } from '@services/asistencia.service'

const usePostAsistencia = () => {
    const handlePostAsistencia = async (asistencias) => {
        try {
            await Promise.all(
                asistencias.map((asistencia) => postAsistencia(asistencia))
            )
        } catch (error) {
            console.error('Error posting asistencia:', error)
        }
    }

    return { handlePostAsistencia }
}

export default usePostAsistencia
