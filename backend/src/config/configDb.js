"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js";

// Importar las nuevas entidades directamente (opcional, para asegurarse de que se carguen)
import Profesor from "../entity/profesor.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Anotacion from "../entity/anotacion.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Curso from "../entity/curso.entity.js";
import User from "../entity/user.entity.js";
import { ROLES } from "../entity/roles.js"; // Corregido aquí

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: 5432,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  entities: [
    Profesor,
    Asignatura,
    Alumno,
    Anotacion,
    Apoderado,
    Curso,
    User,
    ROLES, // Usar el nombre exportado correctamente
  ],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
