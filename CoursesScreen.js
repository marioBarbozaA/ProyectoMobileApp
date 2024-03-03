// CoursesScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CoursesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Lista de Cursos</Text>
      {/* Aquí agregarías la lógica para listar los cursos y las operaciones CRUD */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CoursesScreen;
