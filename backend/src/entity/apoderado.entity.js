"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js";

const ApoderadoSchema = new EntitySchema({
  name: "Apoderado",
  tableName: "apoderados",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "one-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default ApoderadoSchema;
