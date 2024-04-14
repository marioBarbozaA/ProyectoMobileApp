import { Router } from "express";
import { updateStudentCourses } from "../controllers/coursesXStudent.controller";
const router = Router();

router.post("/coursesxstudent/:studentId", updateStudentCourses);
export default router;
