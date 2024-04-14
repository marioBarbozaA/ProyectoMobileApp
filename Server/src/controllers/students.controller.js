import { getConeccion } from "../database/connection"; //conectarse a la base
import sql from "mssql"; //Librería encargada para la tabla de datos

//Funcion para obtener a los estudiantes
export const getStudents = async (req, res) => {
  const pool = await getConeccion();
  const result = await pool
    .request()
    .query("SELECT * FROM [Universidad].[dbo].[Students];"); // llamar a los estudiantes
  res.json(result.recordset);
};

// Función para crear un nuevo estudiante
export const createStudent = async (req, res) => {
  const { Name, Email } = req.body;

  //Validar si el JSON viene Completo
  if (Name === undefined || Email === undefined) {
    return res.status(400).json({ msg: "BAD REQUEST, please fill all fields" });
  }
  // Validar que los campos no estén vacíos y eliminar espacios en blanco al inicio y final
  if (!Name.trim() || !Email.trim()) {
    return res
      .status(400)
      .json({ msg: "Bad Request. Please provide both a name and an email." });
  }
  // Validar que el correo electrónico tenga el dominio correcto
  const emailRegex = /^\S+@estudiantec\.cr$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({
      msg: "Bad Request. Please provide an email address with the domain '@estudiantec.cr'.",
    });
  }

  try {
    const pool = await getConeccion();
    const result = await pool
      .request()
      .input("name", sql.VarChar, Name.trim())
      .input("email", sql.VarChar, Email.trim())
      .query(
        "INSERT INTO [Universidad].[dbo].[Students] (Name, Email) VALUES (@name, @email);"
      );

    // Verifica si se insertó el estudiante
    if (result.rowsAffected[0] > 0) {
      res.status(201).json({ Name, Email });
    } else {
      res.status(400).json({ msg: "The student could not be created." });
    }
  } catch (error) {
    // El código de error exacto para una violación de clave única puede variar según la configuración de tu SQL Server
    if (error.number === 2627) {
      res
        .status(400)
        .json({ msg: "A student with this email already exists." });
    } else {
      console.error(error);
      res.status(500).json({ msg: "Server error while creating student." });
    }
  }
};

// Función para obtener un estudiante por ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "Bad Request. Please provide an ID." });
  }

  try {
    const pool = await getConeccion();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM [Universidad].[dbo].[Students] WHERE Id = @id;");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ msg: "Student not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while retrieving student." });
  }
};

// Función para actualizar un estudiante existente
export const updateStudent = async (req, res) => {
  const { id } = req.params; // El ID del estudiante a actualizar.
  const { Name, Email } = req.body; // Los nuevos valores para Name y/o Email.

  //Validar si el JSON viene Completo
  if (Name === undefined || Email === undefined) {
    return res.status(400).json({ msg: "BAD REQUEST, please fill all fields" });
  }
  // Validar que los campos no estén vacíos y eliminar espacios en blanco al inicio y final
  if (!Name.trim() || !Email.trim()) {
    return res
      .status(400)
      .json({ msg: "Bad Request. Please provide both a name and an email." });
  }
  // Validar que el correo electrónico tenga el dominio correcto
  const emailRegex = /^\S+@estudiantec\.cr$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({
      msg: "Bad Request. Please provide an email address with the domain '@estudiantec.cr'.",
    });
  }

  try {
    const pool = await getConeccion();
    // Inicializa una transacción SQL para ejecutar múltiples comandos de manera segura.
    const transaction = pool.transaction();
    await transaction.begin();

    // Inicializa la solicitud SQL.
    let request = transaction.request();

    // Añade los inputs solo si se proporcionan.
    if (Name) {
      request = request.input("Name", sql.VarChar, Name);
    }
    if (Email) {
      request = request.input("Email", sql.VarChar, Email);
    }

    // Construye la parte SET de la consulta SQL dinámicamente basada en los inputs proporcionados.
    const updates = [];
    if (Name) updates.push("Name = @Name");
    if (Email) updates.push("Email = @Email");
    const setClause = updates.join(", ");

    // Ejecuta la consulta de actualización.
    await request
      .input("Id", sql.Int, id)
      .query(
        `UPDATE [Universidad].[dbo].[Students] SET ${setClause} WHERE Id = @Id;`
      );

    // Confirma la transacción si todo va bien.
    await transaction.commit();

    res.json({ msg: "Student updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while updating student." });
  }
};

// Función para eliminar un estudiante
export const deleteStudent = async (req, res) => {
  const { id } = req.params; // El ID del estudiante a eliminar.

  try {
    const pool = await getConeccion();
    // Iniciar una nueva transacción
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Preparar una solicitud asociada a la transacción para eliminar las relaciones de CoursesXStudent
    const deleteRelationsRequest = new sql.Request(transaction);
    await deleteRelationsRequest
      .input("StudentId", sql.Int, id)
      .query(
        "DELETE FROM [Universidad].[dbo].[CoursesXStudent] WHERE StudentId = @StudentId;"
      );

    // Preparar otra solicitud para eliminar el estudiante
    const deleteStudentRequest = new sql.Request(transaction);
    const result = await deleteStudentRequest
      .input("Id", sql.Int, id)
      .query("DELETE FROM [Universidad].[dbo].[Students] WHERE Id = @Id;");

    // Verificar si se eliminó el estudiante y confirmar la transacción
    if (result.rowsAffected[0] > 0) {
      await transaction.commit();
      res.json({ msg: "Student deleted successfully." });
    } else {
      await transaction.rollback();
      res.status(404).json({ msg: "Student not found." });
    }
  } catch (error) {
    // En caso de error, revertir los cambios
    console.error(error);
    res
      .status(500)
      .json({ msg: "Server error while deleting student.", error });
  }
};
