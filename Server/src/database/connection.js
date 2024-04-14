import sql from "mssql"; //Librería encargada para la tabla de datos

//Configurar la base de datos
const dbSettings = {
  user: "mobile",
  password: "mobile123",
  server: "localhost",
  database: "Universidad",
  options: {
    encrypt: true, //for azure
    trustServerCertificate: true,
  },
};

//Crear función para conectarse a la base de datos
export async function getConeccion() {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (e) {
    console.log(e);
  }
}
