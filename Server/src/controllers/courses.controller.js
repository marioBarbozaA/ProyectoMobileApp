import { getConeccion } from "../database/connection"; //conectarse a la base
import sql from "mssql"; //Librería encargada para la tabla de datos

// GET todos los cursos
export const getCourses = async (req, res) => {
  try {
    const pool = await getConeccion();
    const result = await pool.request().query("SELECT * FROM Courses;");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// GET un curso por ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConeccion();
    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM Courses WHERE Id = @Id;");
    result.recordset.length > 0
      ? res.json(result.recordset[0])
      : res.status(404).send("Course not found.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// POST crear un nuevo curso
export const createCourse = async (req, res) => {
  const { Name, Description } = req.body;
  //Validar si el JSON viene Completo
  if (Name === undefined || Description === undefined) {
    return res.status(400).json({ msg: "BAD REQUEST, please fill all fields" });
  }
  // Validar que los campos no estén vacíos y eliminar espacios en blanco al inicio y final
  if (!Name.trim() || !Description.trim()) {
    return res.status(400).json({
      msg: "Bad Request. Please provide both a name and an description.",
    });
  }
  try {
    const pool = await getConeccion();
    const result = await pool
      .request()
      .input("Name", sql.VarChar, Name)
      .input("Description", sql.Text, Description)
      .query(
        "INSERT INTO Courses (Name, Description) VALUES (@Name, @Description);"
      );
    res.status(201).json({ Name, Description });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE un curso
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConeccion();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const deleteRelationsRequest = new sql.Request(transaction);
    // Primero, elimina las relaciones de este curso en CoursesXStudent
    await deleteRelationsRequest
      .input("CourseId", sql.Int, id)
      .query(
        "DELETE FROM [Universidad].[dbo].[CoursesXStudent] WHERE CourseId = @CourseId;"
      );

    const deleteCourseRequest = new sql.Request(transaction);
    // Luego, elimina el curso
    const result = await deleteCourseRequest
      .input("Id", sql.Int, id)
      .query("DELETE FROM [Universidad].[dbo].[Courses] WHERE Id = @Id;");

    // Verifica si el curso fue eliminado exitosamente
    if (result.rowsAffected[0] > 0) {
      await transaction.commit(); // Confirma las operaciones si el curso se eliminó
      res.send("Course deleted successfully.");
    } else {
      await transaction.rollback(); // Revierte las operaciones si el curso no se encontró
      res.status(404).send("Course not found.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// PUT actualizar un curso
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { Name, Description } = req.body;
  //Validar si el JSON viene Completo
  if (Name === undefined || Description === undefined) {
    return res.status(400).json({ msg: "BAD REQUEST, please fill all fields" });
  }
  // Validar que los campos no estén vacíos y eliminar espacios en blanco al inicio y final
  if (!Name.trim() || !Description.trim()) {
    return res.status(400).json({
      msg: "Bad Request. Please provide both a name and an description.",
    });
  }
  try {
    const pool = await getConeccion();
    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Name", sql.VarChar, Name)
      .input("Description", sql.Text, Description)
      .query(
        "UPDATE Courses SET Name = @Name, Description = @Description WHERE Id = @Id;"
      );
    result.rowsAffected[0] > 0
      ? res.send("Course updated successfully.")
      : res.status(404).send("Course not found.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
