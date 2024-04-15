import { Router } from "express";
import {
  updateStudentCourses,
  getCoursesByStudent,
} from "../controllers/coursesXStudent.controller";
const router = Router();

router.post("/coursesxstudent/:studentId", updateStudentCourses);
router.get("/coursesxstudent/:studentId", getCoursesByStudent);

export default router;
