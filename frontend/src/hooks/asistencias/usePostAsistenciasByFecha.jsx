import { useState } from 'react'
import { postAsistenciasByFecha } from '@services/asistencia.service'

const useGetAsistenciasByFecha = () => {
    const [asistencias, setAsistencias] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchAsistenciasByFecha = async (fecha) => {
        if (!fecha) return
        try {
            setLoading(true)
            const data = await postAsistenciasByFecha(fecha)

            if (!data) {
                throw new Error('No data')
            }

            setAsistencias(data.data)
        } catch (err) {
            console.error('Error fetching asistencias:', err)
            setError(err.message || 'Error fetching asistencias')
        } finally {
            setLoading(false)
        }
    }

    return { asistencias, fetchAsistenciasByFecha, loading, error }
}

export default useGetAsistenciasByFecha
