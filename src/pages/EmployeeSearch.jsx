import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeSearch() {
  const navigate = useNavigate(); // Hook para moverme entre rutas

  // Guardos los valores que el usuario selecciona para buscar
  const [searchType, setSearchType] = useState("");
  const [searchId, setSearchId] = useState("");

  // Aquí guardo el empleado encontrado
  const [employee, setEmployee] = useState(null);

  // Estado para mostrar el mensaje cuando no encuentra nada
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    // Valido que el usuario seleccione tipo e ingrese ID
    if (!searchType || !searchId) {
      alert("Debes llenar todos los campos para buscar.");
      return;
    }

    // Cargo todos los empleados guardados en localStorage
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    console.log("Empleados en localStorage:", empleados);
    console.log("Buscando tipo:", searchType, "id:", searchId);

    // Busco el empleado comparando tipo + identificación
    const found = empleados.find((e) => {
      const tipoMatch =
        e.tipoIdentificacion.toLowerCase().trim() ===
        searchType.toLowerCase().trim();

      const idMatch =
        e.identificacion.toLowerCase().trim() === searchId.toLowerCase().trim();

      console.log(
        `Comparando: tipo [${e.tipoIdentificacion}] vs [${searchType}] => ${tipoMatch}, id [${e.identificacion}] vs [${searchId}] => ${idMatch}`
      );

      return tipoMatch && idMatch;
    });

    // Si no lo encuentra, muestro mensaje y limpio resultado
    if (!found) {
      setEmployee(null);
      setNotFound(true);
      setTimeout(() => setNotFound(false), 2500);
      return;
    }

    // Si encuentra el empleado, lo guardo en el estado
    setEmployee(found);
  };

  const handleClear = () => {
    // Restablezco todos los valores del formulario
    setSearchType("");
    setSearchId("");
    setEmployee(null);
    setNotFound(false);
  };

  const handleCancel = () => {
    // Regreso al menú de gestión de empleados
    navigate("/employees/manage");
  };

  return (
    <div style={styles.container}>
      <h1>Búsqueda de Empleados</h1>

      {/* Si aún no hay un empleado encontrado, muestro el formulario */}
      {!employee && (
        <div style={styles.card}>
          <div style={styles.formGroup}>
            <label>Tipo de Identificación:</label>
            <select
              style={styles.input}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="Cédula">Cédula</option>
              <option value="Cédula de extranjería">Cédula de extranjería</option>
              <option value="PPT">PPT</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Salvoconducto">Salvoconducto</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Número de Identificación:</label>
            <input
              type="text"
              style={styles.input}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>

          <div style={styles.buttonsRow}>
            <button style={styles.button} onClick={handleSearch}>
              Buscar
            </button>

            <button style={styles.buttonSecondary} onClick={handleClear}>
              Limpiar
            </button>

            <button style={styles.buttonCancel} onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Mensaje si no encuentra el empleado */}
      {notFound && <p style={styles.notFound}>Empleado no encontrado.</p>}

      {/* Si encuentra el empleado, muestro su información */}
      {employee && (
        <div style={styles.resultBox}>
          <h2>
            Resultado:{" "}
            <span
              style={{
                color: employee.estado === "Inactivo" ? "red" : "black",
              }}
            >
              {employee.primerNombre} {employee.segundoNombre} {employee.primerApellido}{" "}
              {employee.segundoApellido}
            </span>
          </h2>

          {/* Información del empleado */}
          <p>
            <strong>Tipo ID:</strong> {employee.tipoIdentificacion}
          </p>
          <p>
            <strong>ID:</strong> {employee.identificacion}
          </p>
          <p>
            <strong>Teléfono:</strong> {employee.telefono}
          </p>
          <p>
            <strong>Dirección:</strong> {employee.direccion}
          </p>
          <p>
            <strong>Dependencia:</strong> {employee.dependencia}
          </p>
          <p>
            <strong>Cargo:</strong> {employee.cargo}
          </p>
          <p>
            <strong>Salario base:</strong> ${employee.salarioBase}
          </p>

          <div style={styles.buttonsRow}>
            {/* Botón para ir a actualizar el empleado */}
            <button
              style={styles.button}
              onClick={() => navigate(`/employees/update/${employee.identificacion}`)}
            >
              Actualizar Empleado
            </button>

            {/* Acción para inhabilitar, aún no implementada */}
            <button
              style={styles.buttonSecondary}
              onClick={() => alert("Empleado inhabilitado")}
            >
              Inhabilitar
            </button>

            {/* Regresa al formulario */}
            <button style={styles.buttonCancel} onClick={handleClear}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
  },
  card: {
    border: "1px solid #ccc",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
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
    gap: 10,
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#00bcd4",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "10px 15px",
    backgroundColor: "#ffa000",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  buttonCancel: {
    padding: "10px 15px",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  notFound: {
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  },
  resultBox: {
    marginTop: 30,
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    textAlign: "left",
  },
};

export default EmployeeSearch;
