import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

function PayrollCalculate() {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Estados para capturar tipo de identificación, número y la nómina generada
  const [tipoId, setTipoId] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [nomina, setNomina] = useState(null);

  // Estado para mostrar el modal de guardar como PDF/XLS
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Referencia a la tabla para exportarla como PDF o Excel
  const tableRef = useRef();

  // Función para guardar la nómina en localStorage
  const guardarNominaEnLocalStorage = (tipoId, idEmpleado, nominaObj) => {
    const nominasGuardadas = JSON.parse(localStorage.getItem("nominas")) || [];

    // Verifico si ya existe una nómina guardada para este empleado
    const existeIndex = nominasGuardadas.findIndex(
      (n) => n.tipoId === tipoId && n.id === idEmpleado
    );

    // Si no existe, la agrego. Si existe, la reemplazo
    if (existeIndex === -1) {
      nominasGuardadas.push({
        tipoId,
        id: idEmpleado,
        nomina: nominaObj,
      });
    } else {
      nominasGuardadas[existeIndex].nomina = nominaObj;
    }

    localStorage.setItem("nominas", JSON.stringify(nominasGuardadas));
  };

  // -------- GENERAR DESPRENDIBLE DE NÓMINA --------
  const handleGenerate = () => {
    // Verifico que los campos estén llenos
    if (!tipoId || !idEmpleado) {
      alert("Debes llenar todos los campos.");
      return;
    }

    // Traigo los empleados del localStorage
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    // Busco exactamente el empleado según tipo y número de identificación
    const empleado = empleados.find(
      (e) =>
        (e.tipoIdentificacion || "").toLowerCase().trim() === tipoId.toLowerCase().trim() &&
        (e.identificacion || "").toLowerCase().trim() === idEmpleado.toLowerCase().trim()
    );

    if (!empleado) {
      alert("Empleado no encontrado");
      return;
    }

    // Obtengo todas las horas extras registradas para este empleado
    const horasExtrasData = JSON.parse(localStorage.getItem("horasExtras")) || [];

    const horasExtrasEmpleado = horasExtrasData
      .filter((h) => {
        const tipoEmp = (h.empleado.tipoIdentificacion || h.empleado.tipoId || "").toLowerCase().trim();
        const idEmp = (h.empleado.identificacion || h.empleado.id || "").toLowerCase().trim();
        return tipoEmp === tipoId.toLowerCase().trim() && idEmp === idEmpleado.toLowerCase().trim();
      })
      .reduce((acc, h) => acc + (h.horas || 0), 0);

    // Valor por hora extra (puede variar)
    const valorHoraExtra = empleado.valorHoraExtra || 20000;
    const totalHorasExtras = horasExtrasEmpleado * valorHoraExtra;

    // Obtengo ventas registradas del empleado
    const ventasData = JSON.parse(localStorage.getItem("ventasRegistradas")) || [];

    const registrosEmpleado = ventasData.filter((r) => {
      const tipoEmp = (r.empleado.tipoIdentificacion || r.empleado.tipoId || "").toLowerCase().trim();
      const idEmp = (r.empleado.identificacion || r.empleado.id || "").toLowerCase().trim();
      return tipoEmp === tipoId.toLowerCase().trim() && idEmp === idEmpleado.toLowerCase().trim();
    });

    // Acá sumo todas las ventas del empleado
    let totalVentas = 0;
    registrosEmpleado.forEach((r) => {
      r.ventas.forEach((v) => {
        const unidades = parseFloat(v.unidades);
        const valorUnidad = parseFloat(v.valorUnidad);
        if (!isNaN(unidades) && !isNaN(valorUnidad)) {
          totalVentas += unidades * valorUnidad;
        }
      });
    });

    // Comisión del 2% si supera los 10M
    const comisionVentas = totalVentas > 10000000 ? totalVentas * 0.02 : 0;

    // Auxilio de transporte
    const auxTransporte = empleado.auxTransporte || 0;

    // Cálculo total de ingresos
    const ingresos =
      (empleado.salarioBase || 0) +
      auxTransporte +
      totalHorasExtras +
      comisionVentas;

    // Deducciones legales
    const salud = ingresos * 0.04;
    const pension = ingresos * 0.04;
    const arl = ingresos * 0.00522;

    const deducciones = salud + pension + arl;

    const neto = ingresos - deducciones;

    // Periodo fijo (ahora lo pongo manual)
    const periodo = "01/11/2025 - 30/11/2025";

    // Objeto final de nómina generado
    const nominaGenerada = {
      empleado,
      ingresos,
      totalHorasExtras,
      horasExtras: horasExtrasEmpleado,
      valorHoraExtra,
      comisionVentas,
      auxTransporte,
      salud,
      pension,
      arl,
      deducciones,
      neto,
      periodo,
    };

    // Guardo en estado y en localStorage
    setNomina(nominaGenerada);
    guardarNominaEnLocalStorage(tipoId, idEmpleado, nominaGenerada);
  };

  // Limpiar campos y tabla
  const handleClear = () => {
    setTipoId("");
    setIdEmpleado("");
    setNomina(null);
  };

  // -------- EXPORTAR A PDF --------
  const guardarPDF = () => {
    const doc = new jsPDF("p", "pt", "letter");

    // Exporto la tabla completa como PDF
    doc.html(tableRef.current, {
      callback: function (pdf) {
        pdf.save("nomina.pdf");
      },
      margin: [20, 20, 20, 20],
    });

    setShowSaveModal(false);
  };

  // -------- EXPORTAR A EXCEL --------
  const guardarXLS = () => {
    const table = tableRef.current;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Nomina");
    XLSX.writeFile(workbook, "nomina.xlsx");

    setShowSaveModal(false);
  };

  // -------- IMPRIMIR --------
  const imprimir = () => {
    window.print(); // Uso la impresión del navegador
  };

  return (
    <div style={styles.container}>
      <h1>Calcular Nómina</h1>

      {/* Si no hay nómina generada, muestro el formulario */}
      {!nomina && (
        <>
          <div style={styles.formGroup}>
            <label>Tipo de identificación:</label>
            <select
              style={styles.input}
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
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
            <label>Número de identificación:</label>
            <input
              type="text"
              style={styles.input}
              value={idEmpleado}
              onChange={(e) => setIdEmpleado(e.target.value)}
            />
          </div>

          {/* Botones principales */}
          <div style={styles.buttonsRow}>
            <button style={styles.button} onClick={handleGenerate}>
              Generar Nómina
            </button>
            <button style={styles.buttonSecondary} onClick={handleClear}>
              Limpiar
            </button>
            <button style={styles.buttonCancel} onClick={() => navigate("/payroll")}>
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Si ya generé la nómina, muestro el desprendible */}
      {nomina && (
        <div style={styles.result}>
          <h2>Desprendible de Nómina</h2>

          {/* Tabla completa para PDF/XLS */}
          <table ref={tableRef} style={styles.table} border="1" cellPadding="8">
            <tbody>
              <tr>
                <th>Nombre:</th>
                <td>
                  {nomina.empleado.primerNombre} {nomina.empleado.segundoNombre}{" "}
                  {nomina.empleado.primerApellido} {nomina.empleado.segundoApellido}
                </td>
              </tr>
              <tr>
                <th>Identificación:</th>
                <td>
                  {nomina.empleado.tipoIdentificacion} {nomina.empleado.identificacion}
                </td>
              </tr>
              <tr>
                <th>Cargo:</th>
                <td>{nomina.empleado.cargo}</td>
              </tr>
              <tr>
                <th>Dependencia:</th>
                <td>{nomina.empleado.dependencia}</td>
              </tr>
              <tr>
                <th>Periodo:</th>
                <td>{nomina.periodo}</td>
              </tr>

              <tr>
                <th colSpan="2">
                  <u>Ingresos</u>
                </th>
              </tr>

              <tr>
                <th>Salario Base:</th>
                <td>${(nomina.empleado.salarioBase || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Auxilio Transporte:</th>
                <td>${(nomina.auxTransporte || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <th>
                  Horas Extras: {nomina.horasExtras} horas x ${nomina.valorHoraExtra.toLocaleString()}
                </th>
                <td>${nomina.totalHorasExtras.toLocaleString()}</td>
              </tr>
              <tr>
                <th>Comisiones:</th>
                <td>${(nomina.comisionVentas || 0).toLocaleString()}</td>
              </tr>

              <tr>
                <th colSpan="2">
                  <u>Deducciones</u>
                </th>
              </tr>

              <tr>
                <th>Salud:</th>
                <td>${nomina.salud.toLocaleString()}</td>
              </tr>
              <tr>
                <th>Pensión:</th>
                <td>${nomina.pension.toLocaleString()}</td>
              </tr>
              <tr>
                <th>ARL:</th>
                <td>${nomina.arl.toLocaleString()}</td>
              </tr>

              <tr>
                <th>
                  <strong>Neto a Pagar:</strong>
                </th>
                <td>
                  <strong>${nomina.neto.toLocaleString()}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Botones inferiores */}
          <div style={styles.buttonsRow}>
            <button style={styles.button} onClick={imprimir}>
              Imprimir
            </button>
            <button style={styles.buttonSecondary} onClick={() => setShowSaveModal(true)}>
              Guardar como...
            </button>
            <button style={styles.buttonCancel} onClick={handleClear}>
              Volver
            </button>
          </div>
        </div>
      )}

      {/* Modal para guardar PDF/XLS */}
      {showSaveModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Guardar como...</h3>

            <button style={modalStyles.btn} onClick={guardarPDF}>
              Guardar como PDF
            </button>

            <button style={modalStyles.btn} onClick={guardarXLS}>
              Guardar como XLS
            </button>

            <button style={modalStyles.close} onClick={() => setShowSaveModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos en objeto (inline)
const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 18,
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 8,
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid gray",
    marginTop: 5,
  },
  buttonsRow: {
    display: "flex",
    gap: 10,
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
  buttonSecondary: {
    padding: "10px 20px",
    backgroundColor: "#ffa000",
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
  result: {
    marginTop: 30,
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    textAlign: "left",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

// Estilos del modal
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "8px",
    textAlign: "center",
    width: "300px",
  },
  btn: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    cursor: "pointer",
    background: "#2b6cb0",
    color: "white",
    border: "none",
  },
  close: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    background: "#ccc",
  },
};

export default PayrollCalculate;
