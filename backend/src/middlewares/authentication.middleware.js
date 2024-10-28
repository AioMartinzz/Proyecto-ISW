"use strict";
import passport from "passport";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return handleErrorServer(
        res,
        500,
        "Error de autenticación en el servidor"
      );
    }

    if (!user) {
      return handleErrorClient(
        res,
        401,
        "No tienes permiso para acceder a este recurso",
        { info: info ? info.message : "No se encontró el usuario" }
      );
    }

    // Añadir el usuario autenticado al request para su uso posterior
    req.user = user;

    // Continuar con la siguiente middleware o ruta
    next();
  })(req, res, next);
}

// Middleware opcional para verificar si el usuario tiene un token válido
export function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Obtener el token del header Authorization
  
  if (!token) {
    return handleErrorClient(
      res,
      403,
      "Acceso denegado. No se proporcionó un token."
    );
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return handleErrorClient(
        res,
        403,
        "Token inválido o expirado",
        { info: info ? info.message : "Token no válido" }
      );
    }

    req.user = user; // Añadir el usuario al request si el token es válido
    next();
  })(req, res, next);
}
