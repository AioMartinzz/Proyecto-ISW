import { useState } from 'react'
import { createAsistenciaReport } from '@services/asistencia.service'

const useCreateInformeAsistencia = () => {
    const [informe, setInforme] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createInformeAsistencia = async (informe) => {
        try {
            setLoading(true)
            setError(null)

            const { alumnoId, mes } = informe

            const { blob: pdfBlob, fileName } = await createAsistenciaReport(
                alumnoId,
                mes
            )

            if (!pdfBlob) {
                throw new Error('No se recibió el archivo')
            }

            const url = window.URL.createObjectURL(pdfBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            a.remove()

            setInforme({ success: true })
        } catch (err) {
            console.error('Error al generar el informe:', err)
            setError(err.message || 'Error al generar el informe')
        } finally {
            setLoading(false)
        }
    }

    return { informe, createInformeAsistencia, loading, error }
}

export default useCreateInformeAsistencia
