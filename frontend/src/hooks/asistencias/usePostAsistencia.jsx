import { postAsistencia } from '@services/asistencia.service'

const usePostAsistencia = (fetchAsistencias) => {
    const handlePostAsistencia = async (asistencias) => {
        try {
            await Promise.all(
                asistencias.map((asistencia) => postAsistencia(asistencia))
            )
            fetchAsistencias()
        } catch (error) {
            console.error('Error posting asistencia:', error)
        }
    }

    return { handlePostAsistencia }
}

export default usePostAsistencia
