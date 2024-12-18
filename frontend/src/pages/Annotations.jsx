import React, { useEffect, useState } from 'react';
import axios from '@services/root.service'; // Instancia configurada de Axios
import { getAlumnos } from '@services/alumno.service';
import { getAnotacionesByProfesor, updateAnotacion } from '@services/anotacion.service';
import { getProfesores } from '@services/profesor.service';
import { useUser } from '../context/UserContext';
import '../styles/Annotations.css';

const Annotations = () => {
    const { user } = useUser();
    const [activeView, setActiveView] = useState(''); // Controla la vista activa
    const [anotaciones, setAnotaciones] = useState([]);
    const [editAnotacion, setEditAnotacion] = useState(null);
    const [selectedAlumno, setSelectedAlumno] = useState('');
    const [tipo, setTipo] = useState('Positiva');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [profesorId, setProfesorId] = useState('');
    const [asignaturaId, setAsignaturaId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alumnos, setAlumnos] = useState([]);

    // Obtener alumnos al montar
    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const alumnosData = await getAlumnos();
                setAlumnos(alumnosData);
            } catch (error) {
                console.error('Error al obtener alumnos:', error.message);
            }
        };
        fetchAlumnos();
    }, []);


// Configurar profesorId y asignaturaId
useEffect(() => {
    const fetchProfesorData = async () => {
        try {
            if (user && user.id) {
                console.log('Usuario ID:', user.id); // Mostrar el ID del usuario
                setProfesorId(user.id);

                const { data } = await getProfesores();
                console.log('Datos de Profesores:', data); // Mostrar los datos obtenidos de profesores

                const profesorData = data.find((prof) => Number(prof.usuarioId) === Number(user.id));
                if (profesorData) {
                    setAsignaturaId(profesorData.asignaturaId);
                    console.log('Profesor Encontrado:', profesorData); // Mostrar datos del profesor encontrado
                    console.log('Asignatura ID:', profesorData.asignaturaId); // Mostrar asignaturaId asignado
                } else {
                    console.log('No se encontró al profesor con usuarioId:', user.id);
                }
            }
        } catch (error) {
            console.error('Error al obtener datos del profesor:', error.message);
        }
    };
    fetchProfesorData();
}, [user]);


    // Obtener anotaciones
    const fetchAnotaciones = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await getAnotacionesByProfesor();
            setAnotaciones(data);
        } catch (error) {
            console.error('Error al obtener anotaciones:', error.message);
            setError('Hubo un problema al obtener las anotaciones.');
        } finally {
            setLoading(false);
        }
    };

    // Guardar anotación editada
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editAnotacion) return;

        const updatedAnotacion = { descripcion, fecha, tipo };
        try {
            await updateAnotacion(editAnotacion.id, updatedAnotacion);
            alert('Anotación actualizada con éxito.');
            fetchAnotaciones();
            setActiveView('ver');
        } catch (error) {
            console.error('Error al actualizar anotación:', error.message);
            alert('Error al actualizar la anotación.');
        }
    };

    // Eliminar anotación
    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta anotación?')) return;
        try {
            await axios.delete(`/anotaciones/${id}`);
            alert('Anotación eliminada con éxito.');
            fetchAnotaciones();
        } catch (error) {
            console.error('Error al eliminar anotación:', error.message);
            alert('Error al eliminar la anotación.');
        }
    };

    // Cargar anotación para edición
    const handleEditClick = (anotacion) => {
        setEditAnotacion(anotacion);
        setDescripcion(anotacion.descripcion);
        setFecha(anotacion.fecha);
        setTipo(anotacion.tipo);
        setActiveView('editar');
    };

    // Crear anotación
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAlumno || !tipo || !descripcion || !fecha || !profesorId || !asignaturaId) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const anotacion = { tipo, descripcion, fecha, alumnoId: selectedAlumno, profesorId, asignaturaId };

        try {
            await axios.post('/anotaciones', anotacion);
            alert('Anotación registrada con éxito.');
            fetchAnotaciones();
            setActiveView('ver');
        } catch (error) {
            console.error('Error al crear anotación:', error.message);
            alert('Hubo un problema al crear la anotación.');
        }
    };

    // Renderizar las diferentes vistas
    const renderView = () => {
        switch (activeView) {
            case 'crear':
                return (
                    <div>
                        <h2>Crear Anotación</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Alumno:</label>
                            <select value={selectedAlumno} onChange={(e) => setSelectedAlumno(e.target.value)}>
                                <option value="">Seleccione un alumno</option>
                                {alumnos.map((alumno) => (
                                    <option key={alumno.id} value={alumno.id}>
                                        {alumno.nombreCompleto || alumno.nombre}
                                    </option>
                                ))}
                            </select>
                            <label>ID Profesor:</label>
                            <input value={profesorId} readOnly />
                            <label>ID Asignatura:</label>
                            <input value={asignaturaId} readOnly />
                            <label>Tipo:</label>
                            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                <option value="Positiva">Positiva</option>
                                <option value="Negativa">Negativa</option>
                            </select>
                            <label>Descripción:</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                            <label>Fecha:</label>
                            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                );
            case 'editar':
                return (
                    <div>
                        <h2>Editar Anotación</h2>
                        <form onSubmit={handleSaveEdit}>
                            <label>Descripción:</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                            <label>Tipo:</label>
                            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                <option value="Positiva">Positiva</option>
                                <option value="Negativa">Negativa</option>
                            </select>
                            <label>Fecha:</label>
                            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                            <button type="submit">Guardar Cambios</button>
                            <button type="button" onClick={() => setActiveView('ver')}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                );
            case 'ver':
                return (
                    <div>
                        <h2>Anotaciones Creadas</h2>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : (
                            anotaciones.map((anotacion) => (
                                <div key={anotacion.id} className="anotacion-card">
                                    <p><strong>Descripción:</strong> {anotacion.descripcion}</p>
                                    <p><strong>Tipo:</strong> {anotacion.tipo}</p>
                                    <p><strong>Fecha:</strong> {anotacion.fecha}</p>
                                    <p><strong>Alumno:</strong> {anotacion.alumno.nombreCompleto}</p>
                                    <button onClick={() => handleEditClick(anotacion)}>Editar</button>
                                    <button onClick={() => handleDelete(anotacion.id)}>Eliminar</button>
                                </div>
                            ))
                        )}
                    </div>
                );
            default:
                return <p>Seleccione una opción.</p>;
        }
    };

    return (
        <div className="main-content">
            <h1>Gestión de Anotaciones</h1>
            <button onClick={() => setActiveView('crear')}>Crear Anotación</button>
            <button onClick={() => { setActiveView('ver'); fetchAnotaciones(); }}>Ver Anotaciones</button>
            {renderView()}
        </div>
    );
};

export default Annotations;
