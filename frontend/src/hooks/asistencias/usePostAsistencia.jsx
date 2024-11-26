import { postAsistencia } from '@services/asistencia.service'

const usePostAsistencia = (fetchAsistencias) => {
    const handlePostAsistencia = async (alumnos) => {
        try {
            const asistencias = alumnos.map((alumno) => ({
                alumnoId: alumno.id,
                presente: true,
                fecha: new Date().toISOString(),
            }))
            await Promise.all(
                asistencias.map((asistencia) => postAsistencia(asistencia))
            )
            fetchAsistencias() // Actualiza las asistencias
        } catch (error) {
            console.error('Error posting asistencia:', error)
        }
    }

    return { handlePostAsistencia }
}

export default usePostAsistencia
