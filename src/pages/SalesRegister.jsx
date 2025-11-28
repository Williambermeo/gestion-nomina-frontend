// src/pages/SalesRegister.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mapa para convertir los códigos de tipo de ID en texto legible
const tipoIdMap = {
  CC: "Cédula",
  CE: "Cédula de extranjería",
  PPT: "PPT",
  PAS: "Pasaporte",
  SC: "Salvoconducto",
};

function SalesRegister() {
  const navigate = useNavigate();

  // Estados para manejar datos del formulario y trabajador
  const [tipoId, setTipoId] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [empleado, setEmpleado] = useState(null);

  // Aquí manejo hasta 10 ventas como máximo
  const [ventas, setVentas] = useState([
    { fecha: "", producto: "", unidades: "", valorUnidad: "" },
  ]);

  // Este estado controla si muestro el resumen final
  const [showResumen, setShowResumen] = useState(false);

  // Función que busca el empleado en localStorage
  const cargarEmpleado = () => {
    if (!tipoId || !idEmpleado) {
      alert("Debe seleccionar tipo y número de identificación");
      return;
    }

    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    const tipoTexto = tipoIdMap[tipoId] || tipoId;

    // Aquí hago una búsqueda flexible porque algunos empleados pueden estar guardados con claves distintas
    const encontrado = empleados.find(
      (e) =>
        (e.tipoIdentificacion?.toLowerCase().trim() === tipoTexto.toLowerCase().trim() ||
          e.tipoId?.toLowerCase().trim() === tipoTexto.toLowerCase().trim()) &&
        (e.identificacion?.toLowerCase().trim() === idEmpleado.toLowerCase().trim() ||
          e.id?.toLowerCase().trim() === idEmpleado.toLowerCase().trim())
    );

    if (!encontrado) {
      alert("Empleado no encontrado");
      return;
    }
    setEmpleado(encontrado);
  };

  // Botón para regresar al módulo de ventas
  const cancelarCarga = () => {
    navigate("/sales");
  };

  // Aquí actualizo los campos de cada venta
  const handleVentaChange = (index, field, value) => {
    const nuevasVentas = [...ventas];
    nuevasVentas[index][field] = value;
    setVentas(nuevasVentas);
  };

  // Agrego una nueva venta (máximo 10)
  const agregarVenta = () => {
    if (ventas.length >= 10) return;
    setVentas([
      ...ventas,
      { fecha: "", producto: "", unidades: "", valorUnidad: "" },
    ]);
  };

  // Calculo el total sumando unidad * valorUnidad de todas las ventas
  const calcularTotal = () => {
    return ventas.reduce((acc, v) => {
      const unidades = parseFloat(v.unidades);
      const valorUnidad = parseFloat(v.valorUnidad);
      if (!isNaN(unidades) && !isNaN(valorUnidad)) {
        return acc + unidades * valorUnidad;
      }
      return acc;
    }, 0);
  };

  // Registro la venta en localStorage
  const registrarVentas = () => {
    // Primero valido que todo esté lleno
    for (const v of ventas) {
      if (!v.fecha || !v.producto || !v.unidades || !v.valorUnidad) {
        alert("Por favor, complete todos los campos de cada venta.");
        return;
      }
    }

    // Armo el registro con empleado + ventas + total
    const registro = {
      empleado,
      ventas,
      total: calcularTotal(),
      fechaRegistro: new Date().toISOString(),
    };

    const ventasGuardadas =
      JSON.parse(localStorage.getItem("ventasRegistradas")) || [];
    ventasGuardadas.push(registro);
    localStorage.setItem("ventasRegistradas", JSON.stringify(ventasGuardadas));

    setShowResumen(true);
  };

  // Esta función me permite reiniciar para registrar nuevas ventas
  const reiniciar = () => {
    setEmpleado(null);
    setVentas([{ fecha: "", producto: "", unidades: "", valorUnidad: "" }]);
    setTipoId("");
    setIdEmpleado("");
    setShowResumen(false);
  };

  // Aquí construyo el nombre completo del empleado
  const nombreCompleto = () =>
    [
      empleado?.primerNombre || empleado?.nombre,
      empleado?.segundoNombre,
      empleado?.primerApellido || empleado?.apellido,
      empleado?.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div style={styles.container}>
      <h1>Registrar Ventas</h1>

      {/* Si todavía no he cargado un empleado, muestro el formulario de búsqueda */}
      {!empleado && (
        <div style={styles.formGroup}>
          <label>Tipo de identificación:</label>
          <select
            style={styles.input}
            value={tipoId}
            onChange={(e) => setTipoId(e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="CC">Cédula</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="PPT">PPT</option>
            <option value="PAS">Pasaporte</option>
            <option value="SC">Salvoconducto</option>
          </select>

          <label style={{ marginTop: 10 }}>Número de identificación:</label>
          <input
            style={styles.input}
            type="text"
            value={idEmpleado}
            onChange={(e) => setIdEmpleado(e.target.value)}
          />

          <div style={styles.buttonsRow}>
            <button style={styles.button} onClick={cargarEmpleado}>
              Cargar
            </button>
            <button style={styles.buttonCancel} onClick={cancelarCarga}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Si ya cargué al empleado y no estoy mostrando el resumen */}
      {empleado && !showResumen && (
        <>
          {/* Muestra de datos del empleado cargado */}
          <div style={styles.empleadoInfo}>
            <p>
              <strong>Nombre:</strong> {nombreCompleto()}
            </p>
            <p>
              <strong>Tipo ID:</strong> {empleado.tipoIdentificacion || empleado.tipoId}
            </p>
            <p>
              <strong>Número ID:</strong> {empleado.identificacion || empleado.id}
            </p>
            <p>
              <strong>Cargo:</strong> {empleado.cargo}
            </p>
            <p>
              <strong>Dependencia:</strong> {empleado.dependencia}
            </p>
          </div>

          {/* Tabla donde se registran las ventas */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Fecha Venta</th>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Valor Unidad</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      value={venta.fecha}
                      onChange={(e) =>
                        handleVentaChange(index, "fecha", e.target.value)
                      }
                      style={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={venta.producto}
                      onChange={(e) =>
                        handleVentaChange(index, "producto", e.target.value)
                      }
                      style={styles.tableInput}
                      maxLength={50}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={venta.unidades}
                      onChange={(e) =>
                        handleVentaChange(index, "unidades", e.target.value)
                      }
                      style={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={venta.valorUnidad}
                      onChange={(e) =>
                        handleVentaChange(index, "valorUnidad", e.target.value)
                      }
                      style={styles.tableInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botón para añadir una venta adicional */}
          {ventas.length < 10 && (
            <button style={styles.buttonSecondary} onClick={agregarVenta}>
              Agregar Venta
            </button>
          )}

          {/* Botón para guardar ventas */}
          <button style={styles.button} onClick={registrarVentas}>
            Registrar
          </button>
        </>
      )}

      {/* Resumen final cuando ya todo está registrado */}
      {showResumen && (
        <div style={styles.resumen}>
          <h2>Resumen de Ventas Registradas</h2>
          <p>
            <strong>Empleado:</strong> {nombreCompleto()}
          </p>
          <p>
            <strong>ID:</strong> {empleado.tipoIdentificacion || empleado.tipoId}{" "}
            {empleado.identificacion || empleado.id}
          </p>
          <p>
            <strong>Cargo:</strong> {empleado.cargo}
          </p>
          <p>
            <strong>Dependencia:</strong> {empleado.dependencia}
          </p>

          {/* Tabla con ventas ya calculadas */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Fecha Venta</th>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Valor Unidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, i) => (
                <tr key={i}>
                  <td>{venta.fecha}</td>
                  <td>{venta.producto}</td>
                  <td>{venta.unidades}</td>
                  <td>${parseFloat(venta.valorUnidad).toFixed(2)}</td>
                  <td>${(venta.unidades * venta.valorUnidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: ${calcularTotal().toFixed(2)}</h3>

          {/* Botón para empezar un registro nuevo */}
          <button style={styles.button} onClick={reiniciar}>
            Registrar Nueva Venta
          </button>
        </div>
      )}
    </div>
  );
}

// Estilos del componente
const styles = {
  container: {
    maxWidth: 800,
    margin: "20px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
  },
  input: {
    padding: 8,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  buttonsRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonCancel: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 10,
  },
  empleadoInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  tableInput: {
    width: "100%",
    padding: 6,
    boxSizing: "border-box",
    fontSize: 14,
  },
  resumen: {
    backgroundColor: "#e9ecef",
    padding: 20,
    borderRadius: 6,
  },
};

export default SalesRegister;
