import express from "express";
import config from "./config";
import studentsRoutes from "./routes/students.routes"; //importar estudiantes
import coursesRoutes from "./routes/courses.routers"; //importar cursos
import coursesXStudentRoutes from "./routes/coursesXStudent.routers"; //import
const app = express(); // express

//settings
app.set("port", config.port || 3000);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //para JSON encoding

app.use(studentsRoutes);
app.use(coursesRoutes);
app.use(coursesXStudentRoutes);
// En tu servidor Express (server.js o app.js)
const cors = require("cors");

app.use(cors());
export default app;
