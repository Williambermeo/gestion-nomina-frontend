import React from "react";
import { useNavigate } from "react-router-dom";

function EmployeeManagement() {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  return (
    <div style={styles.container}>

      {/* Botón para volver al Dashboard (Home) */}
      <button style={styles.homeButton} onClick={() => navigate("/dashboard")}>
        🏠 Inicio
      </button>

      <h1>Gestión de Empleados</h1>

      <div style={styles.buttonsContainer}>
        {/* Botón que me lleva al formulario para crear un empleado */}
        <button
          style={styles.button}
          onClick={() => navigate("/employees/create")}
        >
          Crear Empleado
        </button>

        {/* Botón para ir a la pantalla de búsqueda de empleados */}
        <button
          style={styles.button}
          onClick={() => navigate("/employees/search")}
        >
          Buscar Empleado
        </button>

        {/* Botón para ver la lista completa de empleados registrados */}
        <button
          style={styles.button}
          onClick={() => navigate("/employees/list")}
        >
          Listar Empleados
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
    position: "relative",
  },

  homeButton: {
    position: "absolute", // Pongo este botón en la esquina superior izquierda
    top: 0,
    left: 0,
    margin: "10px",
    padding: "10px 15px",
    backgroundColor: "#00796b",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonsContainer: {
    display: "flex", // Contenedor con botones uno debajo del otro
    flexDirection: "column",
    gap: 15,
    marginTop: 30,
    maxWidth: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },

  button: {
    padding: "12px 20px", // Estilos generales de los botones de gestión
    fontSize: 18,
    backgroundColor: "#00bcd4",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default EmployeeManagement;
