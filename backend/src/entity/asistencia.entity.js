import { Entity } from "typeorm";
import { EntitySchema } from "typeorm";
import Alumno from "./alumno.entity.js";

const AsistenciaSchema = new EntitySchema({
  name: "Asistencia",
  tableName: "asistencias",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      nullable: false,
      default: "Ausente",
    },
  },
  relations: {
    alumno: {
      target: "Alumno",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default AsistenciaSchema;
