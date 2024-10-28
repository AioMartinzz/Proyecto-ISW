
"use strict";
import { EntitySchema } from "typeorm";

const GradeSchema = new EntitySchema({
  name: "Grade",
  tableName: "grades",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    studentId: {
      type: "int",
      nullable: false,
    },
    subjectId: {
      type: "int",
      nullable: false,
    },
    score: {
      type: "float",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default GradeSchema;

