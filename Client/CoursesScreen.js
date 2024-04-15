import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import PrincipalButton from "./components/PrincipalButton";

// URL FOR THE CONECCTION WITH THE SERVER
const BASE_URL = "http://192.168.100.15:3000"; /// Con la IP del Wifi que esta conectado

//CRUDS

// Función para obtener todos los cursos desde la API
const getCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/courses`);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al obtener los cursos");
    }
    const courses = await response.json();
    return courses; // Devuelve la lista de cursos
  } catch (error) {
    // En un entorno de producción, manejarías el error más apropiadamente
    console.error("Error al obtener los cursos:", error);
    throw error;
  }
};
// Función para eliminar un curso
const deleteCourse = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al eliminar el curso");
    }
    // No necesitamos el contenido de la respuesta, solo confirmar que fue exitoso
    return true;
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    throw error;
  }
};
// Función para añadir o editar un curso en el backend
const saveCourse = async (course, id) => {
  const url = id ? `${BASE_URL}/courses/${id}` : `${BASE_URL}/courses`;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      const errorResult = await response.text(); // Obtener el texto del error si la respuesta no fue exitosa
      throw new Error(
        errorResult || `Error al ${id ? "editar" : "añadir"} el curso`
      );
    }

    const result = await response.json(); // Esperar a que la promesa se resuelva y obtener el JSON
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CoursesScreen = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para la visibilidad del modal
  const [currentCourse, setCurrentCourse] = useState(null); // Estado para el curso actual en edición
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseId, setCourseId] = useState(null); // Nuevo estado para el Id del curso

  // Función para actualizar la lista de cursos desde el servidor
  const updateCoursesList = async () => {
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de cursos.");
      console.error("Error al cargar los cursos:", error);
    }
  };

  // Llamada en useEffect para cargar cursos inicialmente
  useEffect(() => {
    updateCoursesList();
  }, []);
  // Funcion para submit cursos

  // Función para manejar el envío del formulario del modal
  const handleSubmit = async () => {
    if (!courseName || !courseDescription) {
      Alert.alert("Error", "Por favor ingrese todos los campos.");
      return;
    }

    try {
      const courseData = {
        Name: courseName,
        Description: courseDescription,
        // No necesitamos enviar el Id al backend cuando creamos un nuevo curso
        ...(courseId && { Id: courseId }),
      };

      // Utilizaremos courseId para determinar si estamos añadiendo o editando
      const savedCourse = await saveCourse(courseData, courseId);

      // Actualiza la lista de cursos desde el servidor
      await updateCoursesList();

      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentCourse(null);
    setCourseName("");
    setCourseDescription("");
    setCourseId(null); // Resetear el Id del curso
  };

  // Funciones para manejar el CRUD
  const handleAddCourse = () => {
    console.log("Añadir nuevo curso");
    resetForm();
    setModalVisible(true);
  };

  const handleEditCourse = (course) => {
    console.log("Editar curso", course);
    console.log("Editar curso", course.Id);

    setCurrentCourse(course);
    setCourseName(course.Name);
    setCourseDescription(course.Description);
    setCourseId(course.Id); // Actualizamos el Id del curso
    setModalVisible(true);
  };

  const handleDeleteCourse = async (course_Id) => {
    console.log("Eliminar curso", course_Id);
    try {
      await deleteCourse(course_Id);
      await updateCoursesList();
      Alert.alert(
        "Curso eliminado",
        "El curso ha sido eliminado exitosamente."
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el curso.");
    }
  };

  // Render Item para FlatList
  const renderCourse = ({ item }) => (
    <View style={styles.courseItem}>
      <Text style={styles.courseTitle}>{item.Name}</Text>
      <Text>{item.Description}</Text>
      <View style={styles.buttonsContainer}>
        <PrincipalButton
          title="Editar"
          onPress={() => handleEditCourse(item)}
        />
        <PrincipalButton
          title="Eliminar"
          onPress={() => handleDeleteCourse(item.Id)}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <PrincipalButton title="Añadir Curso" onPress={handleAddCourse} />
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.Id}
      />
      {/* Modal para añadir/editar curso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* Contenido del modal */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Nombre del Curso"
              value={courseName}
              onChangeText={setCourseName}
              placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
            />
            <TextInput
              placeholder="Descripción del Curso"
              value={courseDescription}
              onChangeText={setCourseDescription}
              placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
            />
            <PrincipalButton
              title={currentCourse ? "Editar" : "Añadir"}
              onPress={() => {
                setModalVisible(handleSubmit);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  courseItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  // Estilos para el modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fondo semi-transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    color: "black",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Puedes añadir más estilos según necesites
});

export default CoursesScreen;
