import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import PrincipalButton from "./components/PrincipalButton";
import { getCourses } from "./CoursesScreen"; // Asegúrate de que la ruta sea correcta
export const BASE_URL = "http://192.168.100.15:3000"; /// Con la IP del Wifi que esta conectado

//Obtener estudiantes
const getStudents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/students`);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al obtener los Estudiantes");
    }
    const students = await response.json();
    return students; // Devuelve la lista de cursos
  } catch (error) {
    // En un entorno de producción, manejarías el error más apropiadamente
    console.error("Error al obtener los estudiantes:", error);
    throw error;
  }
};

// Función para añadir o editar un estudiantes en el backend
const saveStudent = async (student, id) => {
  const url = id ? `${BASE_URL}/students/${id}` : `${BASE_URL}/students`;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      const errorResult = await response.text(); // Obtener el texto del error si la respuesta no fue exitosa
      throw new Error(
        errorResult || `Error al ${id ? "editar" : "añadir"} el estudiante`
      );
    }

    const result = await response.json(); // Esperar a que la promesa se resuelva y obtener el JSON
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Función para eliminar un estudiante
const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al eliminar el estudiante");
    }
    // No necesitamos el contenido de la respuesta, solo confirmar que fue exitoso
    return true;
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error);
    throw error;
  }
};

// Función para obtener los cursos matriculados por un estudiante
const getEnrolledCourses = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/coursesxstudent/${studentId}`);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Error al obtener los cursos matriculados.");
    }
    const enrolledCourses = await response.json();
    return enrolledCourses;
  } catch (error) {
    console.error("Error al obtener los cursos matriculados:", error);
    throw error;
  }
};

// Función para actualizar los cursos matriculados por un estudiante
const updateEnrolledCourses = async (studentId, courseIds) => {
  try {
    const response = await fetch(`${BASE_URL}/coursesxstudent/${studentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ CourseIds: courseIds }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        errorData || "Error al actualizar los cursos matriculados."
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al actualizar los cursos matriculados:", error);
    throw error;
  }
};
const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  //Para Matricular
  const [availableCourses, setAvailableCourses] = useState([]);
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  const updateStudentsList = async () => {
    try {
      const fetchedStudents = await getStudents();
      setStudents(fetchedStudents);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de estudiantes.");
      console.error("Error al cargar los estudiantes:", error);
    }
  };

  // Llamada en useEffect para cargar estudiantes inicialmente
  useEffect(() => {
    const loadData = async () => {
      updateStudentsList();
      const loadedCourses = await getCourses();
      setAvailableCourses(loadedCourses);
    };
    loadData();
  }, []);

  // Función para guardar los cambios del estudiante actual
  const handleSaveStudent = async () => {
    if (!studentName || !studentEmail) {
      Alert.alert("Error", "Por favor ingrese todos los campos.");
      return;
    }

    try {
      const studentData = {
        Name: studentName,
        Email: studentEmail,
        // No necesitamos enviar el Id al backend cuando creamos un nuevo curso
        ...(studentId && { Id: studentId }),
      };

      // Utilizaremos courseId para determinar si estamos añadiendo o editando
      const savedStudent = await saveStudent(studentData, studentId);

      // Actualiza la lista de estudiantes desde el servidor
      await updateStudentsList();

      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      resetForm();
    }
  };
  // Función para eliminar un estudiante
  const handleDeleteStudent = async (student_id) => {
    console.log("Eliminar estudiante", student_id);
    try {
      await deleteStudent(student_id);
      await updateStudentsList();
      Alert.alert(
        "Estudiante eliminado",
        "El Estudiante ha sido eliminado exitosamente."
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el Estudiante.");
    }
  };

  const resetForm = () => {
    setStudentName("");
    setStudentEmail("");
    setStudentId(null); // Resetear el Id del estudisnte
    setCurrentStudent(null);
    setSelectedCourseIds([]);
  };
  // Funciones para manejar el CRUD
  const handleAddStudent = () => {
    console.log("Añadir nuevo estudiante");
    resetForm();
    setModalVisible(true);
  };

  const handleEditStudent = (student) => {
    console.log("Editar estudiante", student);
    console.log("Editar estudiante", student.Id);

    setCurrentStudent(student);
    setStudentName(student.Name);
    setStudentEmail(student.Email);
    setStudentId(student.Id); // Actualizamos el Id del curso
    setModalVisible(true);
  };

  const handleOpenEnrollModal = async (student) => {
    try {
      const enrolledCourses = await getEnrolledCourses(student.Id);
      const courses = await getCourses();
      setAvailableCourses(courses);
      // Configura los IDs de los cursos en los que el estudiante ya está matriculado
      const enrolledCourseIds = enrolledCourses.map((course) => course.Id);
      setSelectedCourseIds(enrolledCourseIds);
      setCurrentStudent(student);
      setIsEnrollModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "No se pudieron obtener los cursos.");
      console.error("Error al obtener cursos para matrícula:", error);
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourseIds((selectedCourseIds) => {
      if (selectedCourseIds.includes(courseId)) {
        // Si el curso ya está seleccionado, lo quitamos de la selección
        return selectedCourseIds.filter((id) => id !== courseId);
      } else {
        // Si el curso no está seleccionado, lo añadimos a la selección
        return [...selectedCourseIds, courseId];
      }
    });
  };
  const handleEnrollCourses = async () => {
    try {
      const result = await updateEnrolledCourses(
        currentStudent.Id,
        selectedCourseIds
      );
      Alert.alert(
        "Matrícula actualizada",
        "Los cursos han sido actualizados correctamente."
      );
      setIsEnrollModalVisible(false);
      // Actualizar la lista de estudiantes para reflejar los cambios
      await updateStudentsList();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo actualizar la matrícula del estudiante."
      );
      console.error("Error al actualizar la matrícula:", error);
    } finally {
      setSelectedCourseIds([]);
    }
  };

  // Render Item para FlatList
  const renderStudentItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.Name}</Text>
      <Text>{item.Email}</Text>
      <View style={{ flexDirection: "row" }}>
        {/* Botón para editar */}
        <PrincipalButton
          onPress={() => handleEditStudent(item)}
          title="Editar"
        />
        {/* Botón para eliminar */}
        <PrincipalButton
          onPress={() => handleDeleteStudent(item.Id)}
          title="Eliminar"
        />
        <PrincipalButton
          onPress={() => handleOpenEnrollModal(item)}
          title="Matricular"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.Id}
      />
      <PrincipalButton title="Añadir Estudiante" onPress={handleAddStudent} />

      {/* Modal para añadir/editar estudiantes */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredModalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
              value={studentName}
              onChangeText={setStudentName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
              value={studentEmail}
              onChangeText={setStudentEmail}
            />
            <PrincipalButton
              title={currentStudent ? "Editar" : "Añadir"}
              onPress={() => {
                setModalVisible(handleSaveStudent);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Modal para matricular estudiantes en cursos */}

      <Modal
        visible={isEnrollModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEnrollModalVisible(false)}
      >
        <View style={styles.centeredModalContainer}>
          <View style={styles.modalView}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
            >
              Cursos:
            </Text>
            <FlatList
              data={availableCourses}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.courseItem,
                    selectedCourseIds.includes(item.Id) &&
                      styles.courseItemSelected,
                  ]}
                  onPress={() => handleSelectCourse(item.Id)}
                >
                  <Text style={styles.courseName}>{item.Name}</Text>
                  {/* Aquí podrías añadir un ícono o cambiar el estilo del texto */}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.Id.toString()}
              style={styles.courseList}
            />
            <PrincipalButton
              title="Confirmar Matrícula"
              onPress={handleEnrollCourses}
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
  },
  studentItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Estilos para centrar el modal
    alignSelf: "center",
  },
  centeredModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // fondo semitransparente
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  courseName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  courseStatus: {
    fontSize: 14,
    color: "#555",
  },
  // Estilos para los ítems seleccionados
  courseItemSelected: {
    backgroundColor: "#e7f4e4", // Un verde muy claro
  },
  modalContentContainer: {
    maxHeight: "60%", // Limita la altura máxima del contenedor
  },
  courseList: {
    flexGrow: 0, // Esto permite que la FlatList dentro de un ScrollView no crezca más de lo necesario
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    // Sombra ligera
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
export default StudentsScreen;
