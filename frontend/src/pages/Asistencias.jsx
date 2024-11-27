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
    const [lastFetchedDate, setLastFetchedDate] = useState('')

    const { cursos } = useGetCursos()
    const { alumnos, loading, error } = useGetAlumnos()
    const { handlePostAsistencia } = usePostAsistencia()
    const { asistencias, fetchAsistenciasByFecha } = useGetAsistenciasByFecha()

    useEffect(() => {
        if (
            selectedCourse &&
            selectedDate &&
            selectedDate !== lastFetchedDate
        ) {
            fetchAsistenciasByFecha(selectedDate)
            setLastFetchedDate(selectedDate)
        }
    }, [selectedCourse, selectedDate, fetchAsistenciasByFecha, lastFetchedDate])

    useEffect(() => {
        if (selectedCourse && selectedDate) {
            const alumnosDelCurso = alumnos.filter(
                (alumno) => alumno.curso === parseInt(selectedCourse)
            )

            const updatedAttendanceList = alumnosDelCurso.reduce(
                (acc, alumno) => {
                    const asistencia = asistencias.find(
                        (a) => a.alumnoId === alumno.id
                    )
                    acc[alumno.id] = asistencia
                        ? asistencia.estado === 'Presente'
                        : null
                    return acc
                },
                {}
            )

            setAttendanceList(updatedAttendanceList)
        }
    }, [asistencias, alumnos, selectedCourse, selectedDate])

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value)
        setSelectedDate('')
        setAttendanceList({})
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
                estado: isPresent ? 'Presente' : 'Ausente',
            })
        )

        const asistenciaPost = await handlePostAsistencia(asistencias)

        if (asistenciaPost) {
            alert('Asistencias guardadas correctamente')
        } else {
            alert('Error al guardar las asistencias')
        }

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
                                            parseInt(selectedCourse)
                                    )
                                    .map((alumno) => (
                                        <tr key={alumno.id}>
                                            <td>{alumno.nombreCompleto}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        attendanceList[
                                                            alumno.id
                                                        ] === true
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
                                                    checked={
                                                        attendanceList[
                                                            alumno.id
                                                        ] === false
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
