"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js";
import Asignatura from "./asignatura.entity.js"; // Importar la nueva entidad Asignatura

const ProfesorSchema = new EntitySchema({
  name: "Profesor",
  tableName: "profesores",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "one-to-one",
      joinColumn: true,
      nullable: false,
    },
    asignatura: {
      target: "Asignatura",
      type: "many-to-one", // Relación muchos a uno (un profesor tiene una asignatura)
      joinColumn: true,
      nullable: false,
    },
  },
});

export default ProfesorSchema;
