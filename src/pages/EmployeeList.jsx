import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const navigate = useNavigate();

  // Aquí guardo el filtro seleccionado para ordenar la lista
  const [filter, setFilter] = useState("");

  // Aquí cargo la lista de empleados que vienen del localStorage
  const [list, setList] = useState([]);

  // Cuando el componente se monta, leo los empleados guardados en localStorage
  useEffect(() => {
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    setList(empleados);
  }, []);

  // Función que ordena la lista según el filtro seleccionado
  const handleList = () => {
    if (!filter) {
      alert("Debe seleccionar una opción para listar.");
      return;
    }

    // Hago una copia para evitar modificar la lista original directamente
    let sorted = [...list];

    // Ordeno por dependencia
    if (filter === "dependencia") {
      sorted.sort((a, b) => (a.dependencia || "").localeCompare(b.dependencia || ""));
    }
    // Ordeno por salario base
    else if (filter === "salario") {
      sorted.sort((a, b) => (a.salarioBase || 0) - (b.salarioBase || 0));
    }
    // Ordeno por fecha de ingreso
    else if (filter === "fecha") {
      sorted.sort(
        (a, b) =>
          new Date(a.fechaIngreso || "1900-01-01") -
          new Date(b.fechaIngreso || "1900-01-01")
      );
    }

    setList(sorted);
  };

  // Botón para regresar al menú de gestión de empleados
  const handleCancel = () => {
    navigate("/employees/manage");
  };

  return (
    <div style={styles.container}>
      <h1>Listar Empleados</h1>

      {/* Aquí selecciono el tipo de ordenamiento */}
      <div style={styles.formGroup}>
        <label>Listar por:</label>
        <select
          style={styles.input}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Seleccione una opción...</option>
          <option value="dependencia">Dependencia</option>
          <option value="salario">Salario base</option>
          <option value="fecha">Fecha de ingreso</option>
        </select>
      </div>

      {/* Botones principales */}
      <div style={styles.buttonsRow}>
        <button style={styles.button} onClick={handleList}>
          Listar
        </button>

        <button style={styles.buttonCancel} onClick={handleCancel}>
          Cancelar
        </button>
      </div>

      {/* Tabla con los resultados */}
      {list.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dependencia</th>
              <th>Salario</th>
              <th>Fecha ingreso</th>
            </tr>
          </thead>
          <tbody>
            {list.map((emp, index) => (
              <tr key={index}>
                <td>
                  {/* Construyo el nombre completo */}
                  {emp.primerNombre || ""} {emp.segundoNombre || ""}{" "}
                  {emp.primerApellido || ""} {emp.segundoApellido || ""}
                </td>
                <td>{emp.dependencia || ""}</td>
                <td>${(emp.salarioBase || 0).toLocaleString()}</td>
                <td>{emp.fechaIngreso || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay empleados para mostrar.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    border: "1px solid gray",
    fontSize: 16,
    marginTop: 5,
  },
  buttonsRow: {
    display: "flex",
    gap: 15,
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#00bcd4",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  buttonCancel: {
    padding: "10px 20px",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: 30,
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f0f0f0",
  },
};

export default EmployeeList;
