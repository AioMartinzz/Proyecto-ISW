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
            console.log('Token decodificado:', JSON.parse(jsonPayload));
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

                console.log('Correo del apoderado:', emailApoderado);

                // Obtener todos los usuarios
                const usersResponse = await getUsers();
                console.log('Respuesta cruda de getUsers:', usersResponse);

                // Validar estructura de la respuesta
                const usuarios = Array.isArray(usersResponse)
                    ? usersResponse
                    : Array.isArray(usersResponse.data)
                    ? usersResponse.data
                    : null;

                if (!usuarios) {
                    console.error(
                        'Se esperaba un arreglo de usuarios, pero se recibió:',
                        usersResponse
                    );
                    throw new Error('Estructura de datos inesperada en la respuesta.');
                }

                console.log('Usuarios obtenidos:', usuarios);

                // Buscar apoderado por correo
                const apoderado = usuarios.find(
                    (usuario) =>
                        usuario.email?.trim().toLowerCase() === emailApoderado &&
                        usuario.rol?.toLowerCase() === 'apoderado'
                );

                if (!apoderado) {
                    console.error(
                        'No se encontró un apoderado con el correo proporcionado:',
                        emailApoderado
                    );
                    throw new Error('No se encontró un apoderado con el correo proporcionado.');
                }

                console.log('Apoderado encontrado:', apoderado);

// Obtener todos los alumnos
const alumnosResponse = await getAlumnos();
console.log('Respuesta cruda de getAlumnos:', alumnosResponse);

// Validar estructura de la respuesta
const alumnosData = Array.isArray(alumnosResponse)
    ? alumnosResponse
    : Array.isArray(alumnosResponse.data)
    ? alumnosResponse.data
    : null;

if (!alumnosData) {
    console.error(
        'Se esperaba un arreglo de alumnos, pero se recibió:',
        alumnosResponse
    );
    throw new Error('Estructura de datos inesperada en la respuesta al obtener alumnos.');
}

console.log('Datos de alumnos obtenidos:', alumnosData);


                // Comparar el id del apoderado con el usuarioId en los alumnos
const alumno = alumnosData.find((alumno) => {
    const apoderadoUsuarioId = alumno?.apoderado?.usuarioId;
    console.log(`Comparando apoderadoId: ${apoderado.id} con alumno.apoderado.usuarioId: ${apoderadoUsuarioId}`);
    return apoderadoUsuarioId === apoderado.id;
});


                if (!alumno) {
                    console.error('No se encontró ningún alumno asociado al apoderado con ID:', apoderado.id);
                    throw new Error('No se encontró ningún alumno asociado a este apoderado.');
                }

                console.log('Alumno encontrado:', alumno);
                console.log('ID del Alumno:', alumno.id);

                setAlumnoId(alumno.id); // Guardar el ID del alumno
            } catch (err) {
                console.error('Error en fetchAlumnoIdByApoderado:', err);
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
