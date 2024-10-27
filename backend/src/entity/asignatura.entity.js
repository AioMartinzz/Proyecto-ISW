"use strict";
import { EntitySchema } from "typeorm";

const AsignaturaSchema = new EntitySchema({
  name: "Asignatura",
  tableName: "asignaturas",
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
  },
});

export default AsignaturaSchema;
