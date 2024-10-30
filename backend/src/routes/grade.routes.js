"use strict";
import { Router } from "express";
import { getGrades, registerGrade } from "../controllers/grade.controller.js";

const router = Router();

router.post("/grades", registerGrade);
router.get("/grades", getGrades);

export default router;
