import { useState, useEffect } from 'react'
import { getAsistencias } from '@services/asistencia.service'

const useGetAsistencias = () => {
    const [asistencias, setAsistencias] = useState([])

    const fetchAsistencias = async () => {
        try {
            const data = await getAsistencias()
            setAsistencias(data)
        } catch (error) {
            console.error('Error fetching asistencias:', error)
        }
    }

    useEffect(() => {
        fetchAsistencias()
    }, [])

    return { asistencias, fetchAsistencias }
}

export default useGetAsistencias
