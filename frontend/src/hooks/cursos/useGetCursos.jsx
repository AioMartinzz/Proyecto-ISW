import { useState, useEffect } from 'react'
import { getCursos } from '@services/curso.service'

const useGetCursos = () => {
    const [cursos, setCursos] = useState([])

    const fetchCursos = async () => {
        try {
            const response = await getCursos()
            const data = response.data

            console.log('Data Cursos:', data)

            setCursos(data)
        } catch (error) {
            console.error('Error fetching cursos:', error)
        }
    }

    useEffect(() => {
        fetchCursos()
    }, [])

    return { cursos, fetchCursos, setCursos }
}

export default useGetCursos
