import { useState } from 'react'
import { updateAsistencia } from '@services/asistencia.service'

const useUpdateAsistencia = () => {
    const [updatedAsistencia, setUpdatedAsistencia] = useState({})

    const handleUpdateAsistencia = async (updatedAsistencia) => {
        try {
            const id = updatedAsistencia.id
            const estado = updatedAsistencia.estado

            const data = await updateAsistencia(id, { estado })

            setUpdatedAsistencia(data.data)
        } catch (err) {
            console.error('Error updating asistencia:', err)
        }
    }

    return { updatedAsistencia, handleUpdateAsistencia }
}

export default useUpdateAsistencia
