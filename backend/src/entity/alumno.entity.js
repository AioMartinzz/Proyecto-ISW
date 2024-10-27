"use strict";
import { EntitySchema } from "typeorm";
import Apoderado from "./apoderado.entity.js";
import Curso from "./curso.entity.js";

const AlumnoSchema = new EntitySchema({
  name: "Alumno",
  tableName: "alumnos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCompleto: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      unique: true,
      nullable: false,
    },
    fechaNacimiento: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    apoderado: {
      target: "Apoderado",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
    curso: {
      target: "Curso",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default AlumnoSchema;
