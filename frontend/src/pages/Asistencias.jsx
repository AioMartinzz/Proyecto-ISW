import { useState, useEffect, useCallback } from 'react'
import useGetCursos from '@hooks/cursos/useGetCursos'
import useGetAlumnos from '@hooks/alumnos/useGetAlumnos'
import usePostAsistencia from '@hooks/asistencias/usePostAsistencia'
import useGetAsistenciasByFecha from '@hooks/asistencias/usePostAsistenciasByFecha'
import useUpdateAsistencia from '@hooks/asistencias/useUpdateAsistencia'
import useCreateInformeAsistencia from '@hooks/asistencias/useCreateInformeAsistencia'
import Modal from '@components/Modal'
import '@styles/asistencias.css'

export default function Asistencias() {
    const [selectedCurso, setSelectedCurso] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [attendanceList, setAttendanceList] = useState({})
    const [isExistingAttendance, setIsExistingAttendance] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [reportCurso, setReportCurso] = useState('')
    const [reporteMes, setReporteMes] = useState('')
    const [reporteAlumno, setReporteAlumno] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [shouldFetchAttendance, setShouldFetchAttendance] = useState(false)

    const { cursos } = useGetCursos()
    const {
        alumnos,
        loading: alumnosLoading,
        error: alumnosError,
    } = useGetAlumnos()

    const { handlePostAsistencia } = usePostAsistencia()

    const {
        asistencias,
        fetchAsistenciasByFecha,
        loading: asistenciasLoading,
        error: asistenciasError,
    } = useGetAsistenciasByFecha()

    const { handleUpdateAsistencia } = useUpdateAsistencia()

    const { createInformeAsistencia, loading: creatingInforme } =
        useCreateInformeAsistencia()

    const fetchAttendance = useCallback(async () => {
        if (selectedDate && selectedCurso && shouldFetchAttendance) {
            await fetchAsistenciasByFecha(selectedDate)
            setShouldFetchAttendance(false)
        }
    }, [
        selectedDate,
        selectedCurso,
        shouldFetchAttendance,
        fetchAsistenciasByFecha,
    ])

    useEffect(() => {
        fetchAttendance()
    }, [fetchAttendance])

    useEffect(() => {
        if (selectedCurso && alumnos.length > 0 && asistencias.length > 0) {
            const alumnosDelCurso = alumnos.filter(
                (alumno) => alumno.curso === parseInt(selectedCurso)
            )

            const updatedAttendanceList = alumnosDelCurso.reduce(
                (acc, alumno) => {
                    const asistencia = asistencias.find(
                        (a) => a.alumno.id === alumno.id
                    )
                    acc[alumno.id] = asistencia
                        ? {
                              isPresent: asistencia.estado === 'Presente',
                              id: asistencia.id,
                          }
                        : { isPresent: null, id: null }
                    return acc
                },
                {}
            )

            setAttendanceList(updatedAttendanceList)
            setIsExistingAttendance(asistencias.length > 0)
        } else {
            setAttendanceList({})
            setIsExistingAttendance(false)
        }
    }, [asistencias, alumnos, selectedCurso])

    const handleCursoChange = (e) => {
        setSelectedCurso(e.target.value)
        setAttendanceList({})
        setShouldFetchAttendance(true)
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value)
        setAttendanceList({})
        setShouldFetchAttendance(true)
        setSubmitError(null)
    }

    const handleAttendanceChange = (alumnoId, isPresent) => {
        setAttendanceList((prev) => ({
            ...prev,
            [alumnoId]: { ...prev[alumnoId], isPresent },
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedCurso || !selectedDate) return

        const hoy = new Date().toLocaleDateString('es-Cl', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })

        const [day, month, year] = hoy.split('-')
        const hoyFormatted = `${year}-${month}-${day}`

        if (selectedDate > hoyFormatted) {
            setSubmitError(
                'No se puede marcar asistencia para una fecha futura.'
            )
            return
        }

        if (selectedDate < hoyFormatted) {
            setSubmitError(
                'No se puede marcar asistencia para una fecha pasada.'
            )
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const asistenciasToSubmit = Object.entries(attendanceList).map(
                ([alumnoId, { isPresent, id }]) => ({
                    id,
                    alumnoId,
                    fecha: selectedDate,
                    estado: isPresent ? 'Presente' : 'Ausente',
                })
            )

            for (const asistencia of asistenciasToSubmit) {
                if (asistencia.id) {
                    await handleUpdateAsistencia(asistencia)
                } else {
                    await handlePostAsistencia([asistencia])
                }
            }

            setShouldFetchAttendance(true)
            await fetchAttendance()
        } catch (error) {
            console.error('Error al actualizar asistencias:', error)
            setSubmitError(
                'Hubo un error al actualizar las asistencias. Por favor, inténtalo de nuevo.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleGenerateReport = async () => {
        if (reportCurso && reporteMes && reporteAlumno) {
            try {
                await createInformeAsistencia({
                    alumnoId: reporteAlumno,
                    mes: reporteMes,
                })

                handleCloseModal()
            } catch (error) {
                console.error('Error al generar el informe:', error)
            }
        }
    }

    if (alumnosLoading || asistenciasLoading) return <p>Cargando...</p>
    if (alumnosError) return <p>Error al cargar alumnos: {alumnosError}</p>
    if (asistenciasError)
        return <p>Error al cargar asistencias: {asistenciasError}</p>

    return (
        <div className="asistencias-container">
            <h1 className="asistencias-title">Control de Asistencias</h1>

            <form onSubmit={handleSubmit} className="asistencias-form">
                <div className="form-group">
                    <label htmlFor="curso" className="form-label">
                        Selecciona un curso
                    </label>
                    <select
                        id="curso"
                        value={selectedCurso}
                        onChange={handleCursoChange}
                        className="form-select"
                    >
                        <option value="">Selecciona un curso</option>
                        {cursos.map((curso) => (
                            <option key={curso.id} value={curso.id}>
                                {curso.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="fecha" className="form-label">
                        Selecciona una fecha
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="form-input"
                    />
                </div>

                {selectedCurso && selectedDate && (
                    <div>
                        <h2 className="alumnos-list-title">Lista de Alumnos</h2>
                        <table className="alumnos-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Presente</th>
                                    <th>Ausente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos
                                    .filter(
                                        (alumno) =>
                                            alumno.curso ===
                                            parseInt(selectedCurso)
                                    )
                                    .map((alumno) => (
                                        <tr key={alumno.id}>
                                            <td>{alumno.nombreCompleto}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name={`asistencia-${alumno.id}`}
                                                    checked={
                                                        attendanceList[
                                                            alumno.id
                                                        ]?.isPresent === true
                                                    }
                                                    onChange={() =>
                                                        handleAttendanceChange(
                                                            alumno.id,
                                                            true
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name={`asistencia-${alumno.id}`}
                                                    checked={
                                                        attendanceList[
                                                            alumno.id
                                                        ]?.isPresent === false
                                                    }
                                                    onChange={() =>
                                                        handleAttendanceChange(
                                                            alumno.id,
                                                            false
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Actualizando...'
                                : isExistingAttendance
                                ? 'Actualizar Asistencias'
                                : 'Crear Asistencias'}
                        </button>
                        {submitError && (
                            <p className="error-message">{submitError}</p>
                        )}
                    </div>
                )}
            </form>

            <button
                onClick={handleOpenModal}
                className="generate-report-button"
            >
                Generar Informe de Asistencia
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2>Generar Informe de Asistencia</h2>
                <div className="form-group">
                    <label htmlFor="reportCurso">Curso</label>
                    <select
                        id="reportCurso"
                        value={reportCurso}
                        onChange={(e) => setReportCurso(e.target.value)}
                    >
                        <option value="">Selecciona un curso</option>
                        {cursos.map((curso) => (
                            <option key={curso.id} value={curso.id}>
                                {curso.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="reporteMes">Mes</label>
                    <select
                        id="reporteMes"
                        value={reporteMes}
                        onChange={(e) => setReporteMes(e.target.value)}
                    >
                        <option value="">Selecciona un mes</option>
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="reporteAlumno">Alumno</label>
                    <select
                        id="reporteAlumno"
                        value={reporteAlumno}
                        onChange={(e) => setReporteAlumno(e.target.value)}
                    >
                        <option value="">Selecciona un alumno</option>
                        {alumnos
                            .filter(
                                (alumno) =>
                                    alumno.curso === parseInt(reportCurso)
                            )
                            .map((alumno) => (
                                <option key={alumno.id} value={alumno.id}>
                                    {alumno.nombreCompleto}
                                </option>
                            ))}
                    </select>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={
                        !reportCurso ||
                        !reporteMes ||
                        !reporteAlumno ||
                        creatingInforme
                    }
                >
                    {creatingInforme ? 'Generando...' : 'Generar Informe'}
                </button>
            </Modal>
        </div>
    )
}
