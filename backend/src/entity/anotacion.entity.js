"use strict";
import { EntitySchema } from "typeorm";
import Alumno from "./alumno.entity.js";
import Profesor from "./profesor.entity.js";
import Asignatura from "./asignatura.entity.js";

const AnotacionSchema = new EntitySchema({
  name: "Anotacion",
  tableName: "anotaciones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  relations: {
    alumno: {
      target: "Alumno",
      type: "many-to-one",
      joinColumn: {
        name: "alumnoId",
        referencedColumnName: "id",
      },
      nullable: false,
    },
    profesor: {
      target: "Profesor",
      type: "many-to-one",
      joinColumn: {
        name: "profesorId",
        referencedColumnName: "usuarioId",  // Vincula con el usuarioId en Profesor
      },
      nullable: false,
    },
    asignatura: {
      target: "Asignatura",
      type: "many-to-one",
      joinColumn: {
        name: "asignaturaId",
        referencedColumnName: "id",
      },
      nullable: false,
    },
  },
});

export default AnotacionSchema;
