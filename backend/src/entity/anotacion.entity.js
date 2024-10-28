"use strict";
import { EntitySchema } from "typeorm";
import Alumno from "./alumno.entity.js";
import Profesor from "./profesor.entity.js";

const AnotacionSchema = new EntitySchema({
  name: "Anotacion",
  tableName: "anotaciones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo: {
      type: "varchar",
      length: 20,
      nullable: false, // 'Positiva' o 'Negativa'
    },
    motivo: {
      type: "text",
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    alumno: {
      target: "Alumno",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
    profesor: {
      target: "Profesor",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default AnotacionSchema;
