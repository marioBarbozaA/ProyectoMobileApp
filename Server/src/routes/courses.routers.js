import { Router } from "express";
import {
  deleteCourse,
  createCourse,
  getCourses,
  updateCourse,
  getCourseById,
} from "../controllers/courses.controller";
const router = Router();

router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.delete("/courses/:id", deleteCourse);
router.put("/courses/:id", updateCourse);
router.get("/courses/:id", getCourseById);

export default router;
