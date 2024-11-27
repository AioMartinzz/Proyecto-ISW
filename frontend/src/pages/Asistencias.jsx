import React, { useState, useEffect } from 'react'
import useGetCursos from '@hooks/cursos/useGetCursos'
import useGetAlumnos from '@hooks/alumnos/useGetAlumnos'
import usePostAsistencia from '@hooks/asistencias/usePostAsistencia'
import useGetAsistenciasByFecha from '@hooks/asistencias/usePostAsistenciasByFecha'
import '@styles/asistencias.css'

export default function Asistencias() {
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [attendanceList, setAttendanceList] = useState({})
    const [lastFetchedDate, setLastFetchedDate] = useState('') // Para evitar solicitudes repetidas

    const { cursos } = useGetCursos()
    const { alumnos, loading, error, fetchAlumnos } = useGetAlumnos()
    const { handlePostAsistencia } = usePostAsistencia(fetchAlumnos)
    const { asistencias, fetchAsistenciasByFecha } = useGetAsistenciasByFecha()

    // Cargar las asistencias cuando se seleccione una fecha diferente
    useEffect(() => {
        if (
            selectedCourse &&
            selectedDate &&
            selectedDate !== lastFetchedDate
        ) {
            fetchAsistenciasByFecha(selectedDate) // Pasa la fecha seleccionada
            setLastFetchedDate(selectedDate) // Actualiza la fecha previamente solicitada
        }
    }, [selectedCourse, selectedDate, fetchAsistenciasByFecha, lastFetchedDate])

    // Actualizar la lista de asistencia con la respuesta de la API
    useEffect(() => {
        if (asistencias.length > 0) {
            const updatedAttendanceList = asistencias.reduce(
                (acc, asistencia) => ({
                    ...acc,
                    [asistencia.alumnoId]: asistencia.presente,
                }),
                {}
            )
            setAttendanceList(updatedAttendanceList) // Actualizamos la lista con las asistencias previas
        } else {
            // Si no hay asistencias, podemos dejar la lista vacía
            setAttendanceList({})
        }
    }, [asistencias])

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value)
        setSelectedDate('') // Limpiamos la fecha
        setAttendanceList({}) // Limpiamos la lista de asistencias
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value)
    }

    const handleAttendanceChange = (alumnoId, isPresent) => {
        setAttendanceList((prev) => ({ ...prev, [alumnoId]: isPresent }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedCourse || !selectedDate) return

        const asistencias = Object.entries(attendanceList).map(
            ([alumnoId, isPresent]) => ({
                alumnoId,
                fecha: selectedDate,
                presente: isPresent,
            })
        )

        await handlePostAsistencia(asistencias)
        alert('Asistencias guardadas correctamente')
        setSelectedCourse('')
        setSelectedDate('')
        setAttendanceList({})
    }

    if (loading) return <p>Cargando alumnos...</p>
    if (error) return <p>Error: {error}</p>

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
                        value={selectedCourse}
                        onChange={handleCourseChange}
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

                {selectedCourse && (
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
                )}

                {selectedCourse && selectedDate && (
                    <div>
                        <h2 className="alumnos-list-title">Lista de Alumnos</h2>
                        <div className="alumnos-list">
                            {alumnos
                                .filter(
                                    (alumno) =>
                                        alumno.curso.id ===
                                        parseInt(selectedCourse)
                                )
                                .map((alumno) => (
                                    <div
                                        key={alumno.id}
                                        className="alumno-item"
                                    >
                                        <span>{alumno.nombreCompleto}</span>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAttendanceChange(
                                                        alumno.id,
                                                        true
                                                    )
                                                }
                                                className={`attendance-button ${
                                                    attendanceList[alumno.id]
                                                        ? 'present-button'
                                                        : 'inactive-button'
                                                }`}
                                            >
                                                Presente
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAttendanceChange(
                                                        alumno.id,
                                                        false
                                                    )
                                                }
                                                className={`attendance-button ${
                                                    !attendanceList[alumno.id]
                                                        ? 'absent-button'
                                                        : 'inactive-button'
                                                }`}
                                            >
                                                Ausente
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {selectedDate && (
                    <button type="submit" className="submit-button">
                        Guardar Asistencias
                    </button>
                )}
            </form>
        </div>
    )
}
