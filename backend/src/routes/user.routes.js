"use strict";
import { Router } from "express";
import { isAdmin, authorizeRole } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  createUser // Nueva función para permitir al Administrador crear usuarios
} from "../controllers/user.controller.js";
import { ROLES } from "../entity/roles.js";

const router = Router();

// Aplicar autenticación JWT a todas las rutas
router.use(authenticateJwt);

// Rutas accesibles solo por Administradores
router
  .get("/", isAdmin, getUsers) // Obtener todos los usuarios (solo Admin)
  .post("/create", isAdmin, createUser) // Crear un nuevo usuario (solo Admin)
  .delete("/detail/", isAdmin, deleteUser); // Eliminar un usuario (solo Admin)

// Rutas accesibles para diferentes roles de usuario (Admin, Profesor, Apoderado, Alumno)
router
  .get("/detail/", authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR, ROLES.APODERADO, ROLES.ALUMNO]), getUser) // Ver detalles de un usuario
  .patch("/detail/", authorizeRole([ROLES.ADMINISTRADOR, ROLES.PROFESOR, ROLES.APODERADO, ROLES.ALUMNO]), updateUser); // Actualizar información de un usuario

export default router;
