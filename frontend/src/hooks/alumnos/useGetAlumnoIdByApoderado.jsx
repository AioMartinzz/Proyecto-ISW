import { useState, useEffect } from 'react';
import { getAlumnos } from '@services/alumno.service';
import { getUsers } from '@services/user.service';

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

const useGetAlumnoIdByApoderado = () => {
    const [alumnoId, setAlumnoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAlumnoIdByApoderado = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener el token y decodificarlo
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado.');

            const decodedToken = decodeToken(token);
            if (!decodedToken) throw new Error('Token inválido o mal formado.');

            const emailApoderado = decodedToken.email?.trim().toLowerCase();
            if (!emailApoderado) throw new Error('Correo no encontrado en el token.');

            // Obtener todos los usuarios
            const usersResponse = await getUsers();

            // Validar estructura de la respuesta
            const usuarios = Array.isArray(usersResponse)
                ? usersResponse
                : Array.isArray(usersResponse.data)
                ? usersResponse.data
                : null;

            if (!usuarios) {
                throw new Error('Estructura de datos inesperada en la respuesta.');
            }

            // Buscar apoderado por correo
            const apoderado = usuarios.find(
                (usuario) =>
                    usuario.email?.trim().toLowerCase() === emailApoderado &&
                    usuario.rol?.toLowerCase() === 'apoderado'
            );

            if (!apoderado) {
                throw new Error('No se encontró un apoderado con el correo proporcionado.');
            }

            // Obtener todos los alumnos
            const alumnosResponse = await getAlumnos();

            // Validar estructura de la respuesta
            const alumnosData = Array.isArray(alumnosResponse)
                ? alumnosResponse
                : Array.isArray(alumnosResponse.data)
                ? alumnosResponse.data
                : null;

            if (!alumnosData) {
                throw new Error('Estructura de datos inesperada en la respuesta al obtener alumnos.');
            }

            // Comparar el id del apoderado con el usuarioId en los alumnos
            const alumno = alumnosData.find((alumno) => {
                const apoderadoUsuarioId = alumno?.apoderado?.usuarioId;
                return apoderadoUsuarioId === apoderado.id;
            });

            if (!alumno) {
                throw new Error('No se encontró ningún alumno asociado a este apoderado.');
            }

            setAlumnoId(alumno.id); // Guardar el ID del alumno
        } catch (err) {
            setError(err.message || 'Error al obtener el ID del alumno.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumnoIdByApoderado();
    }, []);

    return { alumnoId, loading, error };
};

export default useGetAlumnoIdByApoderado;

