"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js";

const ApoderadoSchema = new EntitySchema({
  name: "Apoderado",
  tableName: "apoderados",
  columns: {
    usuarioId: {
      type: "int",
      primary: true,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "one-to-one",
      joinColumn: {
        name: "usuarioId",  // Se asegura que `usuarioId` apunte al ID de User
        referencedColumnName: "id",
      },
      nullable: false,
    },
  },
});

export default ApoderadoSchema;
