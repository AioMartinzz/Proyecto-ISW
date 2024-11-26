import React, { useEffect, useState } from 'react';
import { getAlumnos } from '@services/alumno.service'; // Servicio para obtener alumnos

const Annotations = () => {
    const [alumnos, setAlumnos] = useState([]); // Estado para almacenar los alumnos
    const [selectedAlumno, setSelectedAlumno] = useState(''); // Estado para el alumno seleccionado
    const [tipo, setTipo] = useState('Positiva'); // Estado para el tipo de anotación
    const [descripcion, setDescripcion] = useState(''); // Estado para la descripción
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Estado para la fecha con valor inicial

    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const alumnosData = await getAlumnos(); // Obtén los datos del backend
                setAlumnos(alumnosData); // Actualiza el estado con los alumnos
            } catch (error) {
                console.error('Error al obtener alumnos:', error.message);
            }
        };

        fetchAlumnos(); // Llama a la función al cargar el componente
    }, []);

    const handleAgregarAnotacion = () => {
        if (!selectedAlumno || !descripcion || !fecha) {
            alert('Selecciona un alumno, escribe una descripción y selecciona una fecha');
            return;
        }

        const nuevaAnotacion = {
            alumnoId: selectedAlumno, // Enviar el ID del alumno
            tipo,
            descripcion,
            fecha, // Fecha seleccionada
        };

        console.log('Datos para enviar:', nuevaAnotacion);
        // Aquí deberías enviar `nuevaAnotacion` al backend usando tu servicio de anotaciones
    };

    return (
        <div>
            <h1>Anotaciones Registradas</h1>
            <form>
                {/* Selección de alumno */}
                <label htmlFor="alumno">Alumno:</label>
                <select
                    id="alumno"
                    value={selectedAlumno}
                    onChange={(e) => setSelectedAlumno(e.target.value)}
                >
                    <option value="">Seleccione un alumno</option>
                    {alumnos.map((alumno) => (
                        <option key={alumno.id} value={alumno.id}>
                            {alumno.nombreCompleto}
                        </option>
                    ))}
                </select>

                {/* Selección de tipo */}
                <label htmlFor="tipo">Tipo:</label>
                <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="Positiva">Positiva</option>
                    <option value="Negativa">Negativa</option>
                </select>

                {/* Campo de descripción */}
                <label htmlFor="descripcion">Descripción:</label>
                <input
                    id="descripcion"
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Escribe la descripción aquí"
                />

                {/* Campo para seleccionar fecha */}
                <label htmlFor="fecha">Fecha:</label>
                <input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />

                {/* Botón para agregar anotación */}
                <button type="button" onClick={handleAgregarAnotacion}>
                    Agregar Anotación
                </button>
            </form>
        </div>
    );
};

export default Annotations;
