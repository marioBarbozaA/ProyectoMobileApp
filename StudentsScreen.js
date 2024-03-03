// En un nuevo archivo, por ejemplo, StudentsScreen.js
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

function StudentsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Estudiantes</Text>
      {/* Aquí iría la implementación de tus CRUD para estudiantes */}
      <Button
        title="Añadir Estudiante"
        onPress={() => console.log("Añadir estudiante")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudentsScreen;
