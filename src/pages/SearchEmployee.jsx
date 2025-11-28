import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchEmployee() {
  // Estado para almacenar el ID ingresado por el usuario
  const [employeeId, setEmployeeId] = useState("");

  // Hook para redireccionar a otras rutas
  const navigate = useNavigate();

  // Función para manejar la búsqueda del empleado
  const handleSearch = (e) => {
    e.preventDefault();

    // Validación básica: no dejar que busquen si el campo está vacío
    if (!employeeId.trim()) {
      alert("Por favor ingresa un número de documento o ID");
      return;
    }

    // Obtener los empleados guardados en localStorage
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    // Buscar dentro del arreglo el empleado cuyo ID coincida
    const encontrado = empleados.find(emp => emp.identificacion === employeeId);

    // Si no existe, aviso y detengo el proceso
    if (!encontrado) {
      alert("Empleado no encontrado");
      return;
    }

    // Si existe, redirijo a la vista de actualización pasándole el ID
    navigate(`/employees/update/${employeeId}`);
  };

  return (
    <div style={styles.container}>
      <h1>Buscar Empleado</h1>

      {/* Formulario donde el usuario ingresa el ID que quiere consultar */}
      <form onSubmit={handleSearch} style={styles.form}>
        <label style={styles.label}>Número de Documento / ID:</label>

        {/* Input controlado para capturar el ID del empleado */}
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={styles.input}
          placeholder="Ingresa el documento del empleado"
        />

        {/* Botón que ejecuta la búsqueda */}
        <button type="submit" style={styles.button}>
          Buscar
        </button>
      </form>
    </div>
  );
}

// Estilos en línea que aplico al diseño de la página
const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    textAlign: "center",
    fontFamily: "'Roboto', sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
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

export default SearchEmployee;
