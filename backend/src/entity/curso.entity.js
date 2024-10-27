"use strict";
import { EntitySchema } from "typeorm";
import Profesor from "./profesor.entity.js";

const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    nivel: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    año: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    profesorJefe: {
      target: "Profesor",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default CursoSchema;
