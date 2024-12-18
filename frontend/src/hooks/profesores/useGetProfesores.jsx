import { useState, useEffect } from 'react'; 
import { getProfesores } from '@services/profesor.service';
import { getUsers } from '@services/user.service';
import { getAsignaturas } from '@services/asignatura.service.js'; // Importar el nuevo servicio

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

const useGetProfesorIdByEmail = () => {
    const [profesorId, setProfesorId] = useState(null);
    const [asignaturaId, setAsignaturaId] = useState(null);
    const [nombreAsignatura, setNombreAsignatura] = useState(''); // Estado para el nombre de la asignatura
    const [nombreCompleto, setNombreCompleto] = useState(null); // Estado para el nombre completo

    const fetchProfesorIdByEmail = async () => {
        try {
            // Obtener el token y decodificarlo
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado.');

            const decodedToken = decodeToken(token);
            if (!decodedToken) throw new Error('Token inválido o mal formado.');

            const emailProfesor = decodedToken.email?.trim().toLowerCase();
            const nombreCompletoToken = decodedToken.nombreCompleto; // Obtener el nombre completo del token
            if (!emailProfesor) throw new Error('Correo no encontrado en el token.');

            // Guardar el nombre completo del token
            setNombreCompleto(nombreCompletoToken);

            // Obtener todos los usuarios
            const usersResponse = await getUsers();
            const usuarios = Array.isArray(usersResponse)
                ? usersResponse
                : usersResponse.data || null;

            if (!usuarios) throw new Error('Estructura de datos inesperada.');

            // Buscar profesor por correo
            const profesorUsuario = usuarios.find(
                (usuario) =>
                    usuario.email?.trim().toLowerCase() === emailProfesor &&
                    usuario.rol?.toLowerCase() === 'profesor'
            );

            if (!profesorUsuario) throw new Error('No se encontró un profesor con el correo proporcionado.');

            // Obtener todos los profesores
            const profesoresResponse = await getProfesores();
            const profesoresData = Array.isArray(profesoresResponse)
                ? profesoresResponse
                : profesoresResponse.data || null;

            if (!profesoresData) throw new Error('Estructura de datos inesperada.');

            const profesorData = profesoresData.find(
                (profesor) => Number(profesor.usuarioId) === Number(profesorUsuario.id)
            );

            if (!profesorData) throw new Error('No se encontró ningún profesor asociado a este usuario.');

            setProfesorId(profesorData.usuarioId);
            setAsignaturaId(profesorData.asignaturaId);

            // Obtener nombre de la asignatura
            const asignaturas = await getAsignaturas();
            const asignatura = asignaturas.find((a) => a.id === profesorData.asignaturaId);

            if (asignatura) {
                setNombreAsignatura(asignatura.nombre);
            } else {
                console.warn('No se encontró la asignatura para el ID:', profesorData.asignaturaId);
            }
        } catch (err) {
            console.error('Error en fetchProfesorIdByEmail:', err);
        }
    };

    useEffect(() => {
        fetchProfesorIdByEmail();
    }, []);

    return { profesorId, asignaturaId, nombreAsignatura, nombreCompleto }; // Retorna nombre de asignatura
};

export default useGetProfesorIdByEmail;


