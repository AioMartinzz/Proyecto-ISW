import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser,} from "../controllers/user.controller.js";

const router = Router();

// Rutas de usuario
router.post("/", createUser); // Crear usuario
router.delete("/:id", deleteUser); // Eliminar usuario
router.get("/", getUsers); // Obtener todos los usuarios
router.get("/:id", getUser); // Obtener un usuario específico
router.put("/:id", updateUser); // Modificar usuario


export default router;
