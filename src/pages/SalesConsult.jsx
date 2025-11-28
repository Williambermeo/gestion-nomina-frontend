// Importo React y los hooks necesarios
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mapa para convertir abreviaciones de tipo de ID a su nombre completo
const tipoIdMap = {
  CC: "Cédula",
  CE: "Cédula de extranjería",
  PPT: "PPT",
  PAS: "Pasaporte",
  SC: "Salvoconducto",
};

function SalesConsult() {
  const navigate = useNavigate(); // Hook para navegar entre pantallas

  // Estados para guardar los datos del formulario
  const [tipoId, setTipoId] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Estados para manejar si ya consulté, si hay resultado y si el empleado existe
  const [consultaHecha, setConsultaHecha] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Función que ejecuta la búsqueda de ventas del empleado
  const consultarVentas = () => {
    // Validaciones básicas
    if (!tipoId || !idEmpleado) {
      alert("Debe seleccionar tipo y número de identificación");
      return;
    }
    if (!fechaDesde || !fechaHasta) {
      alert("Debe seleccionar fecha desde y hasta");
      return;
    }
    if (fechaDesde > fechaHasta) {
      alert("La fecha desde no puede ser mayor que la fecha hasta");
      return;
    }

    // Obtengo todos los empleados guardados en localStorage
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    // Convierto el tipo de ID abreviado a su texto completo
    const tipoTexto = tipoIdMap[tipoId] || tipoId;

    // Busco el empleado igual que en EmployeeSearch
    const empleadoEncontrado = empleados.find((e) => {
      // Comparo ambos nombres posibles de variables según cómo estén guardados
      const tipoMatch =
        (e.tipoIdentificacion?.toLowerCase().trim() ===
          tipoTexto.toLowerCase().trim()) ||
        (e.tipoId?.toLowerCase().trim() === tipoTexto.toLowerCase().trim());

      const idMatch =
        (e.identificacion?.toLowerCase().trim() === idEmpleado.toLowerCase().trim()) ||
        (e.id?.toLowerCase().trim() === idEmpleado.toLowerCase().trim());

      return tipoMatch && idMatch;
    });

    // Si no existe el empleado, muestro mensaje temporal
    if (!empleadoEncontrado) {
      setNotFound(true);
      setTimeout(() => setNotFound(false), 2500);
      return;
    }

    // Cargo todas las ventas guardadas
    const ventasGuardadas =
      JSON.parse(localStorage.getItem("ventasRegistradas")) || [];

    // Filtro ventas del empleado dentro del rango de fechas
    const registrosEmpleado = ventasGuardadas.filter((r) => {
      // Obtengo tipo e ID del registro
      const tipoEmp =
        r.empleado.tipoIdentificacion || r.empleado.tipoId || "";
      const idEmp = r.empleado.identificacion || r.empleado.id || "";

      const tipoMatch =
        tipoEmp.toLowerCase().trim() === tipoTexto.toLowerCase().trim();
      const idMatch =
        idEmp.toLowerCase().trim() === idEmpleado.toLowerCase().trim();

      // Reviso si alguna venta está dentro del rango
      const tieneVentaEnRango = r.ventas.some(
        (v) => v.fecha >= fechaDesde && v.fecha <= fechaHasta
      );

      return tipoMatch && idMatch && tieneVentaEnRango;
    });

    // Si no hay ventas
    if (registrosEmpleado.length === 0) {
      alert("No se encontraron ventas para el empleado y rango de fechas indicados");
      return;
    }

    // Junto todas las ventas dentro del rango
    let ventasFiltradas = [];
    registrosEmpleado.forEach((r) => {
      const ventasEnRango = r.ventas.filter(
        (v) => v.fecha >= fechaDesde && v.fecha <= fechaHasta
      );
      ventasFiltradas = ventasFiltradas.concat(ventasEnRango);
    });

    // Calculo el total ($) sumando unidades * valorUnidad
    const total = ventasFiltradas.reduce((acc, v) => {
      const unidades = parseFloat(v.unidades);
      const valorUnidad = parseFloat(v.valorUnidad);

      if (!isNaN(unidades) && !isNaN(valorUnidad)) {
        return acc + unidades * valorUnidad;
      }
      return acc;
    }, 0);

    // Guardo el resultado final
    setResultado({ empleado: empleadoEncontrado, ventas: ventasFiltradas, total });
    setConsultaHecha(true);
  };

  // Vuelvo a la página principal de ventas
  const cancelar = () => {
    navigate("/sales");
  };

  // Regreso a la pantalla anterior para hacer otra consulta
  const volverAtras = () => {
    setConsultaHecha(false);
    setResultado(null);
  };

  return (
    <div style={styles.container}>
      <h1>Consultar Ventas</h1>

      {/* FORMULARIO DE CONSULTA */}
      {!consultaHecha && (
        <>
          <div style={styles.formGroup}>
            {/* Selección de tipo de identificación */}
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

            {/* Número de ID */}
            <label style={{ marginTop: 10 }}>Número de identificación:</label>
            <input
              style={styles.input}
              type="text"
              value={idEmpleado}
              onChange={(e) => setIdEmpleado(e.target.value)}
            />

            {/* Rango de fechas */}
            <label style={{ marginTop: 10 }}>Fecha Desde:</label>
            <input
              style={styles.input}
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />

            <label style={{ marginTop: 10 }}>Fecha Hasta:</label>
            <input
              style={styles.input}
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />

            {/* Botones */}
            <div style={styles.buttonsRow}>
              <button style={styles.button} onClick={consultarVentas}>
                Consultar
              </button>
              <button style={styles.buttonCancel} onClick={cancelar}>
                Cancelar
              </button>
            </div>

            {/* Aviso si no se encontró empleado */}
            {notFound && (
              <p style={styles.notFound}>Empleado no encontrado.</p>
            )}
          </div>
        </>
      )}

      {/* RESULTADO DE LA CONSULTA */}
      {consultaHecha && resultado && (
        <div style={styles.resumen}>
          <h2>Resultados de la Consulta</h2>

          {/* Muestro información del empleado */}
          <p>
            <strong>Empleado:</strong>{" "}
            {[resultado.empleado.primerNombre || resultado.empleado.nombre,
              resultado.empleado.segundoNombre,
              resultado.empleado.primerApellido || resultado.empleado.apellido,
              resultado.empleado.segundoApellido]
              .filter(Boolean)
              .join(" ")}
          </p>

          <p><strong>Tipo ID:</strong> {resultado.empleado.tipoIdentificacion || resultado.empleado.tipoId}</p>
          <p><strong>Número ID:</strong> {resultado.empleado.identificacion || resultado.empleado.id}</p>
          <p><strong>Cargo:</strong> {resultado.empleado.cargo}</p>
          <p><strong>Dependencia:</strong> {resultado.empleado.dependencia}</p>

          {/* Tabla con ventas */}
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
              {resultado.ventas.map((v, i) => (
                <tr key={i}>
                  <td>{v.fecha}</td>
                  <td>{v.producto}</td>
                  <td>{v.unidades}</td>
                  <td>${parseFloat(v.valorUnidad).toFixed(2)}</td>
                  <td>${(v.unidades * v.valorUnidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total de ventas */}
          <h3>Total: ${resultado.total.toFixed(2)}</h3>

          {/* Botón para volver */}
          <button style={styles.button} onClick={volverAtras}>
            Atrás
          </button>
        </div>
      )}
    </div>
  );
}

// Estilos en objeto JS
const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
    maxWidth: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    padding: 8,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  buttonsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
  },
  button: {
    padding: "12px 20px",
    fontSize: 16,
    backgroundColor: "#00bcd4",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  buttonCancel: {
    padding: "12px 20px",
    fontSize: 16,
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  resumen: {
    textAlign: "left",
    maxWidth: 700,
    margin: "40px auto",
    backgroundColor: "#f0f4c3",
    padding: 20,
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  notFound: {
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  },
};

export default SalesConsult;
