import React, { useEffect, useState } from 'react';
import axios from '@services/root.service';
import { getAlumnos } from '@services/alumno.service';
import { getAnotacionesByProfesor, updateAnotacion } from '@services/anotacion.service';
import { getProfesores } from '@services/profesor.service';
import { useUser } from '../context/UserContext';
import '../styles/Annotations.css';
import useGetProfesorIdByEmail from '../hooks/profesores/useGetProfesores';

const Annotations = () => {
    const { user } = useUser();
    const [activeView, setActiveView] = useState(''); 
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
    const { 
        profesorId: hookProfesorId, 
        nombreAsignatura, 
        nombreCompleto 
    } = useGetProfesorIdByEmail();

    const [tipoFiltro, setTipoFiltro] = useState('');
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [alumnoFiltro, setAlumnoFiltro] = useState('');
    const [filteredAnotaciones, setFilteredAnotaciones] = useState([]);
    


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
        const fetchAsignatura = async () => {
            try {
                if (hookProfesorId) {
                    setProfesorId(hookProfesorId); // Configura el ID del profesor
    
                    // Obtener datos de profesores
                    const { data } = await getProfesores();
    
                    // Buscar profesor con el ID
                    const profesorData = data.find((prof) => Number(prof.usuarioId) === Number(hookProfesorId));
                    
    
                    // Verificar y asignar asignaturaId
                    if (profesorData?.asignaturaId) {
                        setAsignaturaId(profesorData.asignaturaId);
                    } else {
                        console.error('AsignaturaId no encontrada en profesorData:', profesorData);
                    }
                }
            } catch (error) {
                console.error('Error al obtener datos de asignatura:', error.message);
            }
        };
    
        fetchAsignatura();
    }, [hookProfesorId]);
    

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

    const applyFilters = () => {
        let result = anotaciones;
    
        if (tipoFiltro) {
            result = result.filter((anotacion) => anotacion.tipo === tipoFiltro);
        }
    
        if (fechaFiltro) {
            result = result.filter((anotacion) => anotacion.fecha === fechaFiltro);
        }
    
        if (alumnoFiltro) {
            result = result.filter((anotacion) =>
                anotacion.alumno.nombreCompleto.toLowerCase().includes(alumnoFiltro.toLowerCase())
            );
        }
    
        setFilteredAnotaciones(result);
    };
    
    // Inicializa las anotaciones filtradas con todas las anotaciones al cargar la vista
    useEffect(() => {
        setFilteredAnotaciones(anotaciones);
    }, [anotaciones]);



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
    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('es-ES', options);
    };

    switch (activeView) {
        case 'crear':
            return (
                <div className="view-container">
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

                        <label>Profesor:</label>
                        <input
                            value={nombreCompleto ? `${nombreCompleto} (${profesorId})` : profesorId}
                            readOnly
                        />

                        <label>Asignatura:</label>
                        <input
                            value={nombreAsignatura ? `${nombreAsignatura} (${asignaturaId})` : asignaturaId}
                            readOnly
                        />

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
                <div className="view-container">
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
                <div className="view-container">
                    <h2>Anotaciones Creadas</h2>

                    {/* Filtros */}
                    <div className="filter-container">
                        <h3>Filtrar Anotaciones</h3>
                        <div className="filter-group">
                            <div className="filter-item">
                                <label>Tipo:</label>
                                <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="Positiva">Positiva</option>
                                    <option value="Negativa">Negativa</option>
                                </select>
                            </div>
                            <div className="filter-item">
                                <label>Fecha:</label>
                                <input
                                    type="date"
                                    value={fechaFiltro}
                                    onChange={(e) => setFechaFiltro(e.target.value)}
                                />
                            </div>
                            <div className="filter-item">
                                <label>Alumno:</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del alumno"
                                    value={alumnoFiltro}
                                    onChange={(e) => setAlumnoFiltro(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="filter-button" onClick={applyFilters}>Buscar</button>
                    </div>

                    {loading ? (
                        <p>Cargando...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : filteredAnotaciones.length > 0 ? (
                        <div className="anotaciones-grid">
                            {filteredAnotaciones.map((anotacion) => (
                                <div 
                                    key={anotacion.id} 
                                    className="anotacion-card"
                                    data-tipo={anotacion.tipo}
                                >
                                    <p><strong>Descripción:</strong> {anotacion.descripcion}</p>
                                    <p><strong>Tipo:</strong> {anotacion.tipo}</p>
                                    <p><strong>Fecha:</strong> {formatDate(anotacion.fecha)}</p>
                                    <p><strong>Alumno:</strong> {anotacion.alumno.nombreCompleto}</p>
                                    <button onClick={() => handleEditClick(anotacion)}>
                                        <i className="fas fa-pen-to-square"></i>Editar
                                    </button>
                                    <button onClick={() => handleDelete(anotacion.id)}>
                                        <i className="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No se encontraron anotaciones con los criterios seleccionados.</p>
                    )}
                </div>
            );
        default:
            return <p>Seleccione una opción.</p>;
    }
};



return (
    <div className="main-content">
    <h1 className="anotaciones-title">
        <i className="fas fa-edit"></i> Gestión de Anotaciones
    </h1>

        {}
        <div className="button-container">
            <button onClick={() => setActiveView('crear')}>Crear Anotación</button>
            <button onClick={() => { setActiveView('ver'); fetchAnotaciones(); }}>
                Ver Anotaciones
            </button>
        </div>

        {}
        {renderView()}
    </div>
);

};

export default Annotations;
