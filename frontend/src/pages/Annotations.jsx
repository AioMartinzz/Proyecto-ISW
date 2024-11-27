import React, { useEffect, useState } from 'react';
import { getAlumnos } from '@services/alumno.service'; // Servicio para obtener alumnos
import { useUser } from '../context/UserContext'; // Importar el contexto
import '../styles/Annotations.css';

const Annotations = () => {
    const { user, setUser } = useUser(); // Obtener y permitir actualizar datos del contexto
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

        fetchAlumnos();
    }, []);

    // Actualizar dinámicamente los datos del contexto para ID y asignatura
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value, // Actualiza el campo editado (id o subject)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAlumno || !tipo || !descripcion || !fecha || !user.id || !user.subject) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const anotacion = {
            tipo,
            descripcion,
            fecha,
            alumnoId: selectedAlumno,
            profesorId: user.id,
            asignaturaId: user.subject,
        };

        try {
            const token = localStorage.getItem('token'); // Recuperar el token JWT

            if (!token) {
                alert('Usuario no autenticado. Inicie sesión nuevamente.');
                return;
            }

            const response = await fetch('http://localhost:3000/api/anotaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
                },
                body: JSON.stringify(anotacion),
            });

            if (response.ok) {
                alert('Anotación registrada con éxito');
            } else {
                const errorData = await response.json();
                console.error('Error al registrar la anotación:', errorData);
                alert('Error al registrar la anotación. Verifique los datos ingresados.');
            }
        } catch (error) {
            console.error('Error al registrar anotación:', error);
            alert('Hubo un problema al conectar con el servidor.');
        }
    };

    return (
        <div className="main-content">
            <h1>Registro de Anotaciones</h1>
            <form onSubmit={handleSubmit}>
                {/* ID del Profesor (editable) */}
                <div>
                    <label htmlFor="profesorId">ID del Profesor:</label>
                    <input
                        id="profesorId"
                        name="id"
                        type="text"
                        value={user?.id || ''}
                        onChange={handleUserChange} // Actualiza el contexto
                        placeholder="Escribe el ID del profesor"
                    />
                </div>

                {/* Asignatura del Profesor (editable) */}
                <div>
                    <label htmlFor="asignatura">Asignatura:</label>
                    <input
                        id="asignatura"
                        name="subject"
                        type="text"
                        value={user?.subject || ''}
                        onChange={handleUserChange} // Actualiza el contexto
                        placeholder="Escribe la asignatura"
                    />
                </div>

                {/* Selección de Alumno */}
                <div>
                    <label htmlFor="alumno">Alumno:</label>
                    <select
                        id="alumno"
                        value={selectedAlumno}
                        onChange={(e) => setSelectedAlumno(e.target.value)}
                    >
                        <option value="" disabled>Seleccione un alumno</option>
                        {alumnos.map((alumno) => (
                            <option key={alumno.id} value={alumno.id}>
                                {alumno.nombreCompleto || alumno.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selección de Tipo */}
                <div>
                    <label htmlFor="tipo">Tipo de Anotación:</label>
                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <option value="Positiva">Positiva</option>
                        <option value="Negativa">Negativa</option>
                    </select>
                </div>

                {/* Campo de Descripción */}
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Escribe aquí la descripción..."
                    />
                </div>

                {/* Campo de Fecha */}
                <div>
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                        id="fecha"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </div>

                {/* Botón de Envío */}
                <button type="submit">Registrar Anotación</button>
            </form>
        </div>
    );
};

export default Annotations;


