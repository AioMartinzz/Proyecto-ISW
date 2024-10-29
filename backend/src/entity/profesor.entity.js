"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js";
import Asignatura from "./asignatura.entity.js";

const ProfesorSchema = new EntitySchema({
  name: "Profesor",
  tableName: "profesores",
  columns: {
    usuarioId: {
      type: "int",
      primary: true,
    },
    asignaturaId: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "one-to-one",
      joinColumn: {
        name: "usuarioId",  // Apunta al ID del usuario
        referencedColumnName: "id",
      },
      nullable: false,
    },
    asignatura: {
      target: "Asignatura",
      type: "many-to-one",
      joinColumn: {
        name: "asignaturaId",  // Asegura que asignaturaId apunte al ID de Asignatura
        referencedColumnName: "id",
      },
      nullable: false,
    },
  },
});

export default ProfesorSchema;
