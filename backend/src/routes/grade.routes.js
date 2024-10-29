
"use strict";
import { Router } from "express";
import { registerGrade, getGrades } from "../controllers/grade.controller.js";

const router = Router();

router.post("/grades", registerGrade);
router.get("/grades", getGrades);

export default router;

