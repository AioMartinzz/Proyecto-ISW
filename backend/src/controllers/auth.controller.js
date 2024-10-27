"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import {
  authValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Función para iniciar sesión (para usuarios: Apoderados, Alumnos, Profesores)
export async function login(req, res) {
  try {
    const { body } = req;

    // Validación de los datos de entrada
    const { error } = authValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Servicio para gestionar el inicio de sesión
    const [accessToken, errorToken] = await loginService(body);
    if (errorToken) {
      return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);
    }

    // Configuración de la cookie para almacenar el token JWT
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Función para registrar usuarios (debe ser realizado por el Administrador)
export async function register(req, res) {
  try {
    const { body } = req;

    // Validación de los datos de entrada
    const { error } = registerValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Servicio para gestionar el registro de usuarios
    const [newUser, errorNewUser] = await registerService(body);
    if (errorNewUser) {
      return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);
    }

    handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Función para cerrar sesión (disponible para todos los usuarios autenticados)
export async function logout(req, res) {
  try {
    // Limpieza de la cookie que almacena el token JWT
    res.clearCookie("jwt", { httpOnly: true });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
