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
      type: "numeric",
      nullable: true,
      default: 1.0
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
  indices: [
    {
      name: "IDX_GRADE_STUDENT_2024",
      columns: ["estudiante_id"]
    },
    {
      name: "IDX_GRADE_SUBJECT_2024",
      columns: ["asignatura_id"]
    }
  ]
});

export default GradeSchema;

