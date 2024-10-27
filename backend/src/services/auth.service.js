"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { ROLES } from "../entity/roles.js"; // Importar roles predefinidos

// Servicio para iniciar sesión (para usuarios: Apoderados, Alumnos, Profesores)
export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email }
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para que el Administrador registre nuevos usuarios con roles específicos
export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email, rol } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    // Verificar si el correo ya está en uso
    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    // Verificar si el RUT ya está asociado a una cuenta
    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "RUT ya asociado a una cuenta")];

    // Validar que el rol proporcionado sea uno de los roles predefinidos
    if (![ROLES.PROFESOR, ROLES.ALUMNO, ROLES.APODERADO].includes(rol)) {
      return [null, createErrorMessage("rol", "Rol no válido")];
    }

    // Crear el nuevo usuario con el rol especificado
    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol, // Asignar el rol proporcionado
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para que el Administrador registre al propio Administrador (solo si no existe)
export async function registerAdminService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    // Verificar si ya existe un administrador
    const existingAdmin = await userRepository.findOne({
      where: { rol: ROLES.ADMINISTRADOR }
    });

    if (existingAdmin) {
      return [null, createErrorMessage("rol", "Ya existe un administrador registrado")];
    }

    // Crear un administrador si no existe uno
    const newAdmin = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(password),
      rol: ROLES.ADMINISTRADOR, // Asignar el rol de administrador
    });

    await userRepository.save(newAdmin);

    const { password: _, ...dataAdmin } = newAdmin;

    return [dataAdmin, null];
  } catch (error) {
    console.error("Error al registrar al administrador:", error);
    return [null, "Error interno del servidor"];
  }
}

