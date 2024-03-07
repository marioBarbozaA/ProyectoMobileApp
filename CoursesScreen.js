import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  Modal,
  TextInput,
} from "react-native";
import PrincipalButton from "./components/PrincipalButton";

// Mock de datos de cursos para el ejemplo
const mockCourses = [
  { id: "1", name: "Matemáticas", description: "Curso básico de matemáticas" },
  {
    id: "2",
    name: "Historia",
    description: "Introducción a la historia universal",
  },
  // Añade más cursos según necesites
];

const CoursesScreen = () => {
  const [courses, setCourses] = useState(mockCourses); // Estado para la lista de cursos
  const [modalVisible, setModalVisible] = useState(false); // Estado para la visibilidad del modal
  const [currentCourse, setCurrentCourse] = useState(null); // Estado para el curso actual en edición

  // Funciones para manejar el CRUD
  const handleAddCourse = () => {
    // Aquí lógica para añadir un nuevo curso
    console.log("Añadir nuevo curso");
    setModalVisible(true);
    setCurrentCourse(null); // Limpiar el curso actual para el modal de añadir
  };

  const handleEditCourse = (course) => {
    // Aquí lógica para editar un curso
    console.log("Editar curso", course.id);
    setModalVisible(true);
    setCurrentCourse(course); // Establecer el curso actual para el modal de edición
  };

  const handleDeleteCourse = (courseId) => {
    // Aquí lógica para eliminar un curso
    console.log("Eliminar curso", courseId);
    // Implementar la lógica para eliminar el curso del estado y del backend
  };

  // Render Item para FlatList
  const renderCourse = ({ item }) => (
    <View style={styles.courseItem}>
      <Text style={styles.courseTitle}>{item.name}</Text>
      <Text>{item.description}</Text>
      <View style={styles.buttonsContainer}>
        <PrincipalButton
          title="Editar"
          onPress={() => handleEditCourse(item)}
        />
        <PrincipalButton
          title="Eliminar"
          onPress={() => handleDeleteCourse(item.id)}
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
        keyExtractor={(item) => item.id}
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
              // Aquí lógica para manejar el nombre del curso
              placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro
            />
            <TextInput
              placeholder="Descripción del Curso"
              placeholderTextColor="black" // Esta línea cambia el color del placeholder a negro

              // Aquí lógica para manejar la descripción del curso
            />
            <PrincipalButton
              title="Guardar"
              onPress={() => {
                // Aquí lógica para guardar el curso
                setModalVisible(!modalVisible);
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
