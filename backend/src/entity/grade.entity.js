
"use strict";
import { EntitySchema } from "typeorm";

const GradeSchema = new EntitySchema({
  name: "Grade",
  tableName: "grades",
  columns: {
    grade_id: {
      type: "int",
      primary: true,
      generated: true,
    },
    estudiante_id: {
      type: "int",
      nullable: false,
    },
    asignatura_id: {
      type: "int",
      nullable: false,
    },
    nota: {
      type: "float",
      nullable: false,
    },
    fechacreacion: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    fechaactualizacion: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default GradeSchema;

