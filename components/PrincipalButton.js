import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Definición del componente PrincipalButton
const PrincipalButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// Estilos para el botón y el texto
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff", // Color de fondo azul
    padding: 10, // Espaciado interno
    borderRadius: 5, // Bordes redondeados
    alignItems: "center", // Centrar el texto horizontalmente
    justifyContent: "center", // Centrar el texto verticalmente
    margin: 10, // Margen exterior
  },
  text: {
    color: "#ffffff", // Color de texto blanco
    fontSize: 16, // Tamaño de fuente
  },
});

export default PrincipalButton;
