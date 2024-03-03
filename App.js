import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import PrincipalButton from "./components/PrincipalButton";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CoursesScreen from "./CoursesScreen";
import StudentsScreen from "./StudentsScreen";

// Pantalla de inicio
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.sectionTitle}>Universidad</Text>
        <View style={styles.items}>
          <PrincipalButton
            onPress={() => navigation.navigate("Courses")}
            title="Cursos"
          />
          <PrincipalButton
            onPress={() => navigation.navigate("Students")}
            title="Estudiantes"
          />
        </View>
      </View>
    </View>
  );
}

// Configuración del Stack Navigator
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Inicio" }}
        />
        <Stack.Screen
          name="Courses"
          component={CoursesScreen}
          options={{ title: "Cursos" }}
        />
        <Stack.Screen
          name="Students"
          component={StudentsScreen}
          options={{ title: "Estudiantes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: { paddingTop: 80, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: "bold" },
  items: { marginTop: 20 },
});

export default App;
