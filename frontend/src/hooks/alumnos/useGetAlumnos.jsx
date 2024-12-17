import { useState, useEffect } from 'react'
import { getAlumnos } from '@services/alumno.service'

const useGetAlumnos = () => {
    const [alumnos, setAlumnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchAlumnos = async () => {
        try {
            setLoading(true)
            const response = await getAlumnos()

            const alumnosFormateados = response.map((alumno) => ({
                id: alumno.id,
                nombreCompleto: alumno.nombreCompleto,
                rut: alumno.rut,
                apoderado: alumno.apoderado.usuarioId,
                curso: alumno.curso.id,
            }))

            setAlumnos(alumnosFormateados)
            setError(null)
        } catch (error) {
            console.error('Error fetching alumnos:', error)
            setError('Error al cargar los alumnos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlumnos()
    }, [])

    return { alumnos, loading, error, fetchAlumnos, setAlumnos }
}

export default useGetAlumnos