"use strict";
import User from "../entity/user.entity.js";
import Profesor from "../entity/profesor.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ROLES } from "../entity/roles.js";

// Obtener un usuario específico por ID, RUT o email
export async function getUserService(query) {
  try {
    const { rut, id, email } = query;
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOne({ where: [{ id }, { rut }, { email }] });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;
    return [userData, null];
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los usuarios registrados en el sistema
export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);
    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

// Modificar un usuario existente
export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOne({ where: [{ id }, { rut }, { email }] });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(body.password, userFound.password);
      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id: userFound.id }, dataUserUpdate);
    const userData = await userRepository.findOne({ where: { id: userFound.id } });

    if (!userData) return [null, "Usuario no encontrado después de actualizar"];

    const { password, ...userUpdated } = userData;
    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un usuario existente
export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOne({ where: [{ id }, { rut }, { email }] });

    if (!userFound) return [null, "Usuario no encontrado"];
    if (userFound.rol === ROLES.ADMINISTRADOR) return [null, "No se puede eliminar un usuario con rol de administrador"];

    const userDeleted = await userRepository.remove(userFound);
    const { password, ...dataUser } = userDeleted;
    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

// Crear un nuevo usuario con un rol específico (por el Administrador)
export async function createUserService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const apoderadoRepository = AppDataSource.getRepository(Apoderado);

    const { nombreCompleto, rut, email, password, rol, asignaturaId, cursoId, apoderadoId } = user;

    // Verificar si el correo o el RUT ya están en uso
    const existingEmailUser = await userRepository.findOne({ where: { email } });
    if (existingEmailUser) return [null, "Correo electrónico en uso"];

    const existingRutUser = await userRepository.findOne({ where: { rut } });
    if (existingRutUser) return [null, "RUT ya asociado a una cuenta"];

    // Validar el rol
    if (![ROLES.PROFESOR, ROLES.ALUMNO, ROLES.APODERADO].includes(rol)) {
      return [null, "Rol no válido"];
    }

    // Crear el nuevo usuario
    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(password),
      rol,
    });

    // Mostrar los valores enviados a la tabla 'users'
    console.log("Valores enviados a la tabla users:", newUser);

    const savedUser = await userRepository.save(newUser);

    // Verificar que el ID se haya generado correctamente antes de proceder
    if (!savedUser.id) {
      throw new Error("Error al generar el ID del usuario");
    }

    // Crear registros en las tablas secundarias según el rol
    if (rol === ROLES.PROFESOR) {
      if (!asignaturaId) {
        throw new Error("asignaturaId es requerido para el rol profesor");
      }

      const newProfesor = profesorRepository.create({
        usuarioId: savedUser.id,
        asignaturaId: asignaturaId, // Asocia el profesor a la asignatura especificada
      });
      
      console.log("Valores enviados a la tabla profesores:", newProfesor);
      await profesorRepository.save(newProfesor);

    } else if (rol === ROLES.ALUMNO) {
      const newAlumno = alumnoRepository.create({
        usuarioId: savedUser.id,
        apoderadoId: apoderadoId,
        cursoId: cursoId,
      });
      
      console.log("Valores enviados a la tabla alumnos:", newAlumno);
      await alumnoRepository.save(newAlumno);

    } else if (rol === ROLES.APODERADO) {
      const newApoderado = apoderadoRepository.create({
        usuarioId: savedUser.id,
      });

      // Mostrar los valores enviados a la tabla 'apoderados'
      console.log("Valores enviados a la tabla apoderados:", newApoderado);

      await apoderadoRepository.save(newApoderado);
    }

    const { password: _, ...dataUser } = savedUser;
    return [dataUser, null];
  } catch (error) {
    console.error("Error al crear un usuario con rol específico:", error);
    return [null, "Error interno del servidor"];
  }
}



