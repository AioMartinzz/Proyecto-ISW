import { useState, useEffect } from 'react'
import { postAsistenciasByFecha } from '@services/asistencia.service'

const useGetAsistenciasByFecha = () => {
    const [asistencias, setAsistencias] = useState([])

    const fetchAsistenciasByFecha = async (fecha) => {
        try {
            const data = await postAsistenciasByFecha(fecha)
            setAsistencias(data.data)
        } catch (err) {
            console.error('Error fetching asistencias:', err)
        }
    }

    useEffect(() => {
        fetchAsistenciasByFecha()
    }, [])

    return { asistencias, fetchAsistenciasByFecha }
}

export default useGetAsistenciasByFecha
