import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";
import { ROLES } from "../entity/roles.js";

const router = Router();

// Rutas de usuario
router.post(
  "/",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  createUser,
); // Crear usuario

router.delete(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  deleteUser,
); // Eliminar usuario

router.get("/", getUsers); // Obtener todos los usuarios
router.get(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  getUser,
); // Obtener usuario por ID

router.put(
  "/:id",
  authenticateJwt,
  authorizeRole([ROLES.ADMINISTRADOR]),
  updateUser,
); // Actualizar usuario

export default router;
