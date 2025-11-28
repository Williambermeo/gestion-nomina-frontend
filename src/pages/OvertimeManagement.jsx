import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mapa para convertir abreviaciones de identificación en su texto completo
// (me sirve para comparar correctamente contra lo que hay guardado en localStorage)
const tipoIdMap = {
  CC: "Cédula",
  CE: "Cédula de extranjería",
  PPT: "PPT",
  PAS: "Pasaporte",
  SC: "Salvoconducto",
};

function ExtraHoursManagement() {
  const navigate = useNavigate(); // Para volver al dashboard cuando sea necesario

  // Estados para manejar toda la información que requiere el registro
  const [tipoId, setTipoId] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [empleado, setEmpleado] = useState(null); // Aquí cargo el empleado encontrado
  const [fecha, setFecha] = useState(""); // Fecha del registro de horas extras
  const [horaInicio, setHoraInicio] = useState(""); // Hora en que empiezan las extras
  const [horaFin, setHoraFin] = useState(""); // Hora en que terminan
  const [motivo, setMotivo] = useState(""); // Razón por la cual se hicieron las horas extras
  const [autorizadoPor, setAutorizadoPor] = useState(""); // Quién autorizó las horas extras
  const [showReporte, setShowReporte] = useState(false); // Control para mostrar el reporte
  const [horasExtrasRegistradas, setHorasExtrasRegistradas] = useState([]); // Lista de horas extras
  const [notFound, setNotFound] = useState(false); // Para mostrar mensaje de “empleado no encontrado”

  // Función para buscar al empleado en localStorage
  const buscarEmpleado = () => {
    if (!tipoId || !idEmpleado) {
      alert("Seleccione tipo y número de identificación");
      return;
    }

    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    const tipoTexto = tipoIdMap[tipoId] || tipoId;

    // Busco coincidencia respetando los posibles nombres de campo
    const encontrado = empleados.find((e) => {
      const tipoEmp = e.tipoIdentificacion || e.tipoId || "";
      const idEmp = e.identificacion || e.id || "";

      return (
        tipoEmp.toLowerCase().trim() === tipoTexto.toLowerCase().trim() &&
        idEmp.toLowerCase().trim() === idEmpleado.toLowerCase().trim()
      );
    });

    // Si no lo encuentro, muestro aviso
    if (!encontrado) {
      setNotFound(true);
      setTimeout(() => setNotFound(false), 2500);
      return;
    }

    setEmpleado(encontrado); // Si lo encuentro, lo guardo en el estado
  };

  // Calculo las horas extras a partir de la hora inicio y fin
  const calcularHorasExtras = () => {
    if (!horaInicio || !horaFin) return 0;

    const [hiH, hiM] = horaInicio.split(":").map(Number);
    const [hfH, hfM] = horaFin.split(":").map(Number);

    let inicio = hiH * 60 + hiM;
    let fin = hfH * 60 + hfM;

    // Valido que la hora fin no sea menor que la hora inicio
    if (fin < inicio) {
      alert("Hora fin debe ser mayor que hora inicio");
      return 0;
    }

    return (fin - inicio) / 60; // Paso los minutos a horas
  };

  // Registro las horas extras en localStorage
  const registrarHorasExtras = () => {
    if (!empleado) {
      alert("Debe cargar un empleado primero");
      return;
    }

    if (!fecha || !horaInicio || !horaFin || !motivo || !autorizadoPor) {
      alert("Complete todos los campos");
      return;
    }

    const horas = calcularHorasExtras();
    if (horas <= 0) return;

    // Creo el objeto con el registro
    const nuevoRegistro = {
      empleado,
      fecha,
      horaInicio,
      horaFin,
      horas,
      motivo,
      autorizadoPor,
    };

    // Cargo los registros existentes, agrego este y vuelvo a guardar
    const registrosGuardados = JSON.parse(localStorage.getItem("horasExtras")) || [];
    registrosGuardados.push(nuevoRegistro);
    localStorage.setItem("horasExtras", JSON.stringify(registrosGuardados));

    // Actualizo estado y muestro reporte
    setHorasExtrasRegistradas(registrosGuardados);
    setShowReporte(true);
  };

  // Consulta de horas extras por empleado
  const consultarHorasExtras = () => {
    if (!empleado) {
      alert("Primero cargue un empleado para consultar sus horas extras");
      return;
    }

    const registrosGuardados = JSON.parse(localStorage.getItem("horasExtras")) || [];

    const tipoTextoEmpleado = empleado.tipoIdentificacion || empleado.tipoId || "";
    const idEmpleadoActual = empleado.identificacion || empleado.id || "";

    // Filtro todas las horas extras correspondientes a este empleado
    const registrosFiltrados = registrosGuardados.filter((r) => {
      const tipoEmp = r.empleado.tipoIdentificacion || r.empleado.tipoId || "";
      const idEmp = r.empleado.identificacion || r.empleado.id || "";

      return (
        tipoEmp.toLowerCase().trim() === tipoTextoEmpleado.toLowerCase().trim() &&
        idEmp.toLowerCase().trim() === idEmpleadoActual.toLowerCase().trim()
      );
    });

    if (registrosFiltrados.length === 0) {
      alert("No se encontraron horas extras registradas para este empleado");
    }

    setHorasExtrasRegistradas(registrosFiltrados);
    setShowReporte(true);
  };

  // Botón cancelar → regreso al dashboard
  const cancelar = () => {
    navigate("/dashboard");
  };

  // Botón atrás → reseteo pantalla y vuelvo al formulario inicial
  const volverAtras = () => {
    setShowReporte(false);
    setEmpleado(null);
    setTipoId("");
    setIdEmpleado("");
    setFecha("");
    setHoraInicio("");
    setHoraFin("");
    setMotivo("");
    setAutorizadoPor("");
    setHorasExtrasRegistradas([]);
  };

  // Sumo todas las horas registradas (para el reporte)
  const totalHorasExtras = horasExtrasRegistradas.reduce(
    (acc, r) => acc + (r.horas || 0),
    0
  );

  return (
    <div style={styles.container}>
      <h1>Gestión de Horas Extras</h1>

      {/* Si NO estoy en modo reporte, muestro el formulario */}
      {!showReporte && (
        <>
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

            {/* Botones para cargar empleado, consultar horas extras o cancelar */}
            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <button style={styles.button} onClick={buscarEmpleado}>
                Cargar Empleado
              </button>
              <button style={styles.buttonSecondary} onClick={consultarHorasExtras}>
                Consultar Horas Extras
              </button>
              <button style={styles.buttonCancel} onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </div>

          {/* Si ya cargué el empleado, muestro su tabla y el formulario de registro */}
          {empleado && (
            <>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <th>Nombre</th>
                    <td>{empleado.primerNombre || empleado.nombre}</td>
                  </tr>
                  <tr>
                    <th>Apellido</th>
                    <td>{empleado.primerApellido || empleado.apellido}</td>
                  </tr>
                  <tr>
                    <th>Tipo ID</th>
                    <td>{empleado.tipoIdentificacion || empleado.tipoId}</td>
                  </tr>
                  <tr>
                    <th>Número ID</th>
                    <td>{empleado.identificacion || empleado.id}</td>
                  </tr>
                  <tr>
                    <th>Cargo</th>
                    <td>{empleado.cargo}</td>
                  </tr>
                  <tr>
                    <th>Dependencia</th>
                    <td>{empleado.dependencia}</td>
                  </tr>
                </tbody>
              </table>

              {/* Formulario de registro de horas extras */}
              <div style={styles.formGroup}>
                <label>Fecha:</label>
                <input
                  style={styles.input}
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />

                <label style={{ marginTop: 10 }}>Periodo de horas extras:</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <span style={{ alignSelf: "center" }}>a</span>
                  <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  />
                </div>

                <label style={{ marginTop: 10 }}>Motivo:</label>
                <input
                  style={styles.input}
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  maxLength={100}
                />

                <label style={{ marginTop: 10 }}>Autorizado por:</label>
                <input
                  style={styles.input}
                  type="text"
                  value={autorizadoPor}
                  onChange={(e) => setAutorizadoPor(e.target.value)}
                  maxLength={100}
                />

                <button style={styles.button} onClick={registrarHorasExtras}>
                  Registrar
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Vista del reporte */}
      {showReporte && (
        <div style={styles.reporte}>
          <h2>Reporte de Horas Extras Registradas</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Horas Extras</th>
                <th>Motivo</th>
                <th>Autorizado Por</th>
              </tr>
            </thead>
            <tbody>
              {horasExtrasRegistradas.map((r, i) => (
                <tr key={i}>
                  <td>
                    {[r.empleado.primerNombre || r.empleado.nombre,
                      r.empleado.primerApellido || r.empleado.apellido]
                      .filter(Boolean)
                      .join(" ")}
                  </td>
                  <td>{r.fecha}</td>
                  <td>{r.horaInicio}</td>
                  <td>{r.horaFin}</td>
                  <td>{r.horas.toFixed(2)}</td>
                  <td>{r.motivo}</td>
                  <td>{r.autorizadoPor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total Horas Extras Registradas: {totalHorasExtras.toFixed(2)}</h3>

          <button style={styles.button} onClick={volverAtras}>
            Atrás
          </button>
          <button style={styles.buttonCancel} onClick={cancelar}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

// Estilos en línea que utilizo en esta pantalla
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
    gap: 12,
    marginBottom: 20,
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    padding: 8,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px 25px",
    fontSize: 16,
    backgroundColor: "#00bcd4",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 15,
  },
  buttonSecondary: {
    padding: "12px 25px",
    fontSize: 16,
    backgroundColor: "#ffa000",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 15,
  },
  buttonCancel: {
    padding: "12px 25px",
    fontSize: 16,
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 15,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  },
  reporte: {
    textAlign: "left",
    maxWidth: 700,
    margin: "40px auto",
    backgroundColor: "#e1f5fe",
    padding: 20,
    borderRadius: 8,
  },
};

export default ExtraHoursManagement;
