import { useState, useEffect } from 'react';
import { getProfesores } from '@services/profesor.service';
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

const useGetProfesorIdByEmail = () => {
    const [profesorId, setProfesorId] = useState(null);
    const [asignaturaId, setAsignaturaId] = useState(null);

    const fetchProfesorIdByEmail = async () => {
        try {
            // Obtener el token y decodificarlo
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado.');

            const decodedToken = decodeToken(token);
            if (!decodedToken) throw new Error('Token inválido o mal formado.');

            const emailProfesor = decodedToken.email?.trim().toLowerCase();
            if (!emailProfesor) throw new Error('Correo no encontrado en el token.');

            console.log('Correo del profesor:', emailProfesor);

            // Obtener todos los usuarios
            const usersResponse = await getUsers();
            const usuarios = Array.isArray(usersResponse)
                ? usersResponse
                : Array.isArray(usersResponse.data)
                ? usersResponse.data
                : null;

            if (!usuarios) {
                console.error('Estructura de datos inesperada en la respuesta de usuarios:', usersResponse);
                throw new Error('Estructura de datos inesperada.');
            }

            console.log('Usuarios obtenidos:', usuarios);

            // Buscar profesor por correo
            const profesorUsuario = usuarios.find(
                (usuario) =>
                    usuario.email?.trim().toLowerCase() === emailProfesor &&
                    usuario.rol?.toLowerCase() === 'profesor'
            );

            if (!profesorUsuario) {
                console.error('No se encontró un profesor con el correo proporcionado:', emailProfesor);
                throw new Error('No se encontró un profesor con el correo proporcionado.');
            }

            console.log('Usuario profesor encontrado:', profesorUsuario);

            // Obtener todos los profesores
            const profesoresResponse = await getProfesores();
            const profesoresData = Array.isArray(profesoresResponse)
                ? profesoresResponse
                : Array.isArray(profesoresResponse.data)
                ? profesoresResponse.data
                : null;

            if (!profesoresData) {
                console.error('Estructura de datos inesperada en la respuesta de profesores:', profesoresResponse);
                throw new Error('Estructura de datos inesperada.');
            }

            console.log('Datos de profesores obtenidos:', profesoresData);

            // Comparar el usuarioId del profesor en los datos de profesores
            const profesorData = profesoresData.find(
                (profesor) => Number(profesor.usuarioId) === Number(profesorUsuario.id)
            );

            if (!profesorData) {
                console.error('No se encontró ningún profesor asociado al usuario con ID:', profesorUsuario.id);
                throw new Error('No se encontró ningún profesor asociado a este usuario.');
            }

            console.log('Profesor encontrado:', profesorData);
            console.log('ID del Profesor:', profesorData.usuarioId);
            console.log('ID de la Asignatura:', profesorData.asignaturaId);

            setProfesorId(profesorData.usuarioId); // Guardar el ID del profesor
            setAsignaturaId(profesorData.asignaturaId); // Guardar el ID de la asignatura
        } catch (err) {
            console.error('Error en fetchProfesorIdByEmail:', err);
        }
    };

    useEffect(() => {
        fetchProfesorIdByEmail();
    }, []);

    return { profesorId, asignaturaId };
};

export default useGetProfesorIdByEmail;

