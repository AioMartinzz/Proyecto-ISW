"use strict";
import User from "../entity/user.entity.js";
import Profesor from "../entity/profesor.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);

    const userCount = await userRepository.count();
    if (userCount > 0) return;

    // Crear algunas asignaturas de ejemplo
    const matematicas = asignaturaRepository.create({ nombre: "Matemáticas" });
    const lenguaje = asignaturaRepository.create({ nombre: "Lenguaje" });
    const ciencias = asignaturaRepository.create({ nombre: "Ciencias" });

    await asignaturaRepository.save([matematicas, lenguaje, ciencias]);

    // Crear usuarios
    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "apoderado",
        })
      ),
      // Crear un profesor con asignatura de Matemáticas
      (async () => {
        const profesorUsuario = userRepository.create({
          nombreCompleto: "Alexander Benjamín Carrasco",
          rut: "20.630.735-8",
          email: "profesor.matematicas2024@gmail.cl",
          password: await encryptPassword("prof1234"),
          rol: "profesor",
        });
        await userRepository.save(profesorUsuario);

        const profesor = profesorRepository.create({
          usuario: profesorUsuario,
          asignatura: matematicas, // Asignar Matemáticas
        });
        await profesorRepository.save(profesor);
      })(),
      // Crear otro profesor con asignatura de Lenguaje
      (async () => {
        const profesorUsuario = userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "profesor.lenguaje2024@gmail.cl",
          password: await encryptPassword("prof1234"),
          rol: "profesor",
        });
        await userRepository.save(profesorUsuario);

        const profesor = profesorRepository.create({
          usuario: profesorUsuario,
          asignatura: lenguaje, // Asignar Lenguaje
        });
        await profesorRepository.save(profesor);
      })(),
      // Crear alumnos
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "alumno1.2024@gmail.cl",
          password: await encryptPassword("alum1234"),
          rol: "alumno",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "alumno2.2024@gmail.cl",
          password: await encryptPassword("alum1234"),
          rol: "alumno",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "alumno3.2024@gmail.cl",
          password: await encryptPassword("alum1234"),
          rol: "alumno",
        })
      ),
    ]);

    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };
