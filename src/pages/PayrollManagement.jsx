// src/pages/PayrollManagement.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

function PayrollManagement() {
  const navigate = useNavigate(); // Hook para poder hacer navegación entre rutas

  return (
    <div style={styles.container}>

      {/* Botón para regresar al Dashboard (Inicio) */}
      <button style={styles.homeButton} onClick={() => navigate("/dashboard")}>
        🏠 Inicio
      </button>

      <h2>Gestión de Nómina</h2>

      {/* Contenedor donde pongo los botones principales de este módulo */}
      <div style={styles.buttonsContainer}>

        {/* Botón para ir a la página donde calculo la nómina */}
        <button
          style={styles.button}
          onClick={() => navigate("/payroll/calculate")}
        >
          Calcular Nómina
        </button>

        {/* Botón para ir a la página donde consulto la nómina */}
        <button
          style={styles.button}
          onClick={() => navigate("/payroll/consult")}
        >
          Consultar Nómina
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
    position: "relative", // Esto lo uso para poder posicionar el botón de Home en la esquina
  },

  // Estilos del botón que me lleva al inicio
  homeButton: {
    position: "absolute",
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

  // Contenedor donde organizo los botones en columna
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginTop: 30,
    maxWidth: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },

  // Estilos de cada botón del módulo de nómina
  button: {
    padding: "12px 20px",
    fontSize: 18,
    backgroundColor: "#00bcd4",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default PayrollManagement;
