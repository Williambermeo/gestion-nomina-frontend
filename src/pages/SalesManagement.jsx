// src/pages/SalesManagement.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function SalesManagement() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Botón Home */}
      <button style={styles.homeButton} onClick={() => navigate("/dashboard")}>
        🏠 Inicio
      </button>

      <h1>Gestión de Ventas</h1>

      <div style={styles.buttonsContainer}>
        <button
          style={styles.button}
          onClick={() => navigate("/sales/register")}
        >
          Registrar Ventas
        </button>

        <button
          style={styles.button}
          onClick={() => navigate("/sales/consult")}
        >
          Consultar Ventas
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
    position: "relative", // Necesario para el botón Inicio
  },
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
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginTop: 30,
    maxWidth: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },
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

export default SalesManagement;
