import { getConeccion } from "../database/connection"; //conectarse a la base
import sql from "mssql"; //Librería encargada para la tabla de datos

export const updateStudentCourses = async (req, res) => {
  const { studentId } = req.params;
  const { CourseIds } = req.body; // Se espera que esto sea un array de IDs de cursos.

  try {
    const pool = await getConeccion();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    // Elimina todas las inscripciones existentes de este estudiante.
    const deleteRequest = new sql.Request(transaction);
    await deleteRequest
      .input("StudentId", sql.Int, studentId)
      .query(
        "DELETE FROM [Universidad].[dbo].[CoursesXStudent] WHERE StudentId = @StudentId;"
      );

    // Procede solo si hay cursos para inscribir.
    if (CourseIds && CourseIds.length) {
      const insertRequest = new sql.Request(transaction);

      // Construye la consulta para insertar las nuevas asociaciones.
      const values = CourseIds.map((Id) => `(${studentId}, ${Id})`).join(",");
      await insertRequest.query(`
          INSERT INTO [Universidad].[dbo].[CoursesXStudent] (StudentId, CourseId)
          VALUES ${values};
        `);
    }

    // Si todo es correcto, confirma la transacción.
    await transaction.commit();
    res
      .status(200)
      .json({ msg: "La inscripción del estudiante ha sido actualizada." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};
export const getCoursesByStudent = async (req, res) => {
  const { studentId } = req.params; // Obtiene el ID del estudiante desde los parámetros de la ruta

  try {
    const pool = await getConeccion();
    const result = await pool.request().input("StudentId", sql.Int, studentId)
      .query(`
              SELECT c.Id, c.Name, c.Description
              FROM CoursesXStudent cx
              JOIN Courses c ON cx.CourseId = c.Id
              WHERE cx.StudentId = @StudentId;
          `);

    // Siempre devuelve una respuesta con estado 200 y un arreglo (que puede estar vacío)
    res.json(result.recordset);
  } catch (error) {
    console.error("Error retrieving courses by student: ", error);
    res
      .status(500)
      .json({ message: "Error retrieving courses by student", error });
  }
};
