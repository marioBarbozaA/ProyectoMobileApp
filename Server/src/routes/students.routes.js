import { Router } from "express";
import {
  deleteStudent,
  createStudent,
  getStudents,
  updateStudent,
  getStudentById,
} from "../controllers/students.controller";
const router = Router();

router.get("/students", getStudents);
router.post("/students", createStudent);
router.delete("/students/:id", deleteStudent);
router.put("/students/:id", updateStudent);
router.get("/students/:id", getStudentById);

export default router;
