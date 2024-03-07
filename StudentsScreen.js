import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PrincipalButton from "./components/PrincipalButton";
import { Picker } from "@react-native-picker/picker"; // Asegúrate de instalar esta librería si no está incluida en tu proyecto

// Mock de datos de estudiantes para el ejemplo
const mockCourses = [
  { id: "1", name: "Matemáticas" },
  { id: "2", name: "Literatura" },
  { id: "3", name: "Ciencias" },
  // ... otros cursos
];

const mockStudents = [
  { id: "1", name: "Juan Perez", email: "juan.perez@example.com", courses: [] },
  { id: "2", name: "Ana Gomez", email: "ana.gomez@example.com", courses: [] },
  // ... otros estudiantes
];
const StudentsScreen = () => {
  const [students, setStudents] = useState(mockStudents);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    name: "",
    email: "",
    courses: [],
  });
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Función para abrir el modal para añadir/editar un estudiante
  const handleOpenStudentModal = (student) => {
    setCurrentStudent(student);
    setSelectedCourses(student.courses);
    setModalVisible(true);
  };

  // Función para manejar la selección de cursos
  const handleSelectCourse = (courseId) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        // Si ya está seleccionado, lo eliminamos
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prevSelectedCourses, courseId];
      }
    });
  };

  // Función para guardar los cambios del estudiante actual
  const handleSaveStudent = () => {
    // Aquí se debería enviar la información al backend y actualizar el estado
    setModalVisible(false);
  };
  // Función para eliminar un estudiante
  const handleDeleteStudent = (studentId) => {
    // Aquí deberías también eliminar el estudiante del backend
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  };

  // ...
  // Render Item para FlatList
  const renderStudentItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text>{item.email}</Text>
      <View style={{ flexDirection: "row" }}>
        {/* Botón para editar */}
        <PrincipalButton
          onPress={() => handleOpenStudentModal(item)}
          title="Editar"
        />
        {/* Botón para eliminar */}
        <PrincipalButton
          onPress={() => handleDeleteStudent(item.id)}
          title="Borrar"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
      />
      <PrincipalButton
        title="Añadir Estudiante"
        onPress={() =>
          handleOpenStudentModal({ name: "", email: "", courses: [] })
        }
      />

      {/* Modal para añadir/editar estudiantes */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
            value={currentStudent.name}
            onChangeText={(text) =>
              setCurrentStudent({ ...currentStudent, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
            value={currentStudent.email}
            onChangeText={(text) =>
              setCurrentStudent({ ...currentStudent, email: text })
            }
          />

          {/* Lista de cursos para seleccionar */}
          <Text>Cursos:</Text>
          {mockCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseItem}
              onPress={() => handleSelectCourse(course.id)}
            >
              <Text style={{ marginRight: 10 }}>{course.name}</Text>
              <Text>
                {selectedCourses.includes(course.id)
                  ? "Seleccionado"
                  : "No Seleccionado"}
              </Text>
            </TouchableOpacity>
          ))}

          <PrincipalButton
            title="Guardar Estudiante"
            onPress={handleSaveStudent}
          />
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});
export default StudentsScreen;
