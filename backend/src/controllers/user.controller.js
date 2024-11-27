"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
  createUserService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
  createUserValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Obtener un usuario específico por ID, RUT o email
export async function getUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { error } = userQueryValidation.validate({ rut, id, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, id, email });
    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los usuarios registrados en el sistema
export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Modificar un usuario existente
export async function updateUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({ rut, id, email });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const { error: bodyError } = userBodyValidation.validate(body);
    if (bodyError)
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);

    const [user, userError] = await updateUserService({ rut, id, email }, body);
    if (userError) return handleErrorClient(res, 400, "Error modificando al usuario", userError);

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un usuario existente
export async function deleteUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { error: queryError } = userQueryValidation.validate({ rut, id, email });

    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const [userDelete, errorUserDelete] = await deleteUserService({ rut, id, email });
    if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminando al usuario", errorUserDelete);

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Crear un nuevo usuario con un rol específico (por el Administrador)
export async function createUser(req, res) {
  try {
    const { body } = req;

    // Validar los datos para la creación de un nuevo usuario con rol
    const { error } = createUserValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    // Llamar al servicio para crear el usuario y las entidades adicionales según el rol
    const [newUser, errorNewUser] = await createUserService(body);

    if (errorNewUser) return handleErrorClient(res, 400, "Error creando el usuario", errorNewUser);

    handleSuccess(res, 201, "Usuario creado exitosamente", newUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}



