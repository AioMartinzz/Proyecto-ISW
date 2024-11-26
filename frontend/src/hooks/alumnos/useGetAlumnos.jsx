import { useState, useEffect } from 'react'
import { getAlumnos } from '@services/alumno.service'

const useGetAlumnos = () => {
    const [alumnos, setAlumnos] = useState([])

    const fetchAlumnos = async () => {
        try {
            const data = await getAlumnos()

            const alumnos = data.data

            const alumnosFormateados = alumnos.map((alumno) => ({
                id: alumno.id,
                nombreCompleto: alumno.nombreCompleto,
                rut: alumno.rut,
                apoderado: alumno.apoderado.usuarioId,
                curso: alumno.curso.id,
            }))

            console.log('Data Alumnos:', alumnosFormateados)

            setAlumnos(data)
        } catch (error) {
            console.error('Error fetching alumnos:', error)
        }
    }

    useEffect(() => {
        fetchAlumnos()
    }, [])

    return { alumnos, fetchAlumnos, setAlumnos }
}

export default useGetAlumnos
