// Importo React y los hooks que necesito para manejar estados y referencias
import React, { useState, useRef } from "react";

// Importo jsPDF para generar PDFs y XLSX para exportar Excel
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

// Importo useNavigate para poder devolverme o moverme entre páginas
import { useNavigate } from "react-router-dom";

function ConsultaNomina() {
  const navigate = useNavigate(); // Inicializo navigate para redirigir

  // Estado para guardar tipo de documento y número digitado
  const [tipoId, setTipoId] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");

  // Estado donde dejo el resultado de la consulta (si existe)
  const [resultado, setResultado] = useState(null);

  // Estado para activar el modal de guardar como PDF o Excel
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Referencia a la tabla que se va a imprimir/exportar
  const tableRef = useRef();

  // -------------------------------------------------------------
  // FUNCIÓN PARA BUSCAR EMPLEADO Y SU NÓMINA EN LOCALSTORAGE
  // -------------------------------------------------------------
  const handleSearch = () => {
    // Valido que haya seleccionado tipo y número
    if (!tipoId || !idEmpleado) {
      alert("Debes ingresar tipo y número de identificación");
      return;
    }

    // Traigo listado de empleados del localStorage
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    // Busco el empleado exactamente por su tipo y número
    const empleadoEncontrado = empleados.find(
      (e) =>
        e.tipoIdentificacion.toLowerCase().trim() === tipoId.toLowerCase().trim() &&
        e.identificacion.toLowerCase().trim() === idEmpleado.toLowerCase().trim()
    );

    // Si no lo encuentro, aviso
    if (!empleadoEncontrado) {
      alert("Empleado no encontrado en la base de datos.");
      return;
    }

    // Traigo las nóminas guardadas
    const nominas = JSON.parse(localStorage.getItem("nominas")) || [];

    // Busco la nómina asociada a este empleado
    const nominaEncontrada = nominas.find(
      (n) =>
        (n.tipoIdentificacion?.toLowerCase().trim() === tipoId.toLowerCase().trim() ||
         n.tipoId?.toLowerCase().trim() === tipoId.toLowerCase().trim()) &&
        (n.identificacion?.toLowerCase().trim() === idEmpleado.toLowerCase().trim() ||
         n.id?.toLowerCase().trim() === idEmpleado.toLowerCase().trim())
    );

    // Si no existe nómina registrada
    if (!nominaEncontrada) {
      alert("Nómina no encontrada para este empleado.");
      return;
    }

    // Algunas nóminas pueden estar guardadas dentro de un campo, verifico eso
    const nomina = nominaEncontrada.nomina || nominaEncontrada;

    // Aseguro que la info del empleado sea la más actual
    nomina.empleado = empleadoEncontrado;

    // Guardo el resultado para mostrarlo en pantalla
    setResultado(nomina);
  };

  // -------------------------------------------------------------
  // FUNCIÓN PARA GUARDAR EN PDF LA NÓMINA
  // -------------------------------------------------------------
  const guardarPDF = () => {
    const doc = new jsPDF("p", "pt", "letter"); // Configuro PDF tamaño carta

    // Genero el PDF a partir de la tabla referenciada
    doc.html(tableRef.current, {
      callback: (pdf) => pdf.save("nomina_consulta.pdf"),
      margin: [20, 20, 20, 20],
      autoPaging: "text",
    });

    setShowSaveModal(false); // Cierro modal
  };

  // -------------------------------------------------------------
  // FUNCIÓN PARA GUARDAR EXCEL
  // -------------------------------------------------------------
  const guardarXLS = () => {
    // Convierto la tabla en hoja de Excel
    const worksheet = XLSX.utils.table_to_sheet(tableRef.current);
    const workbook = XLSX.utils.book_new();

    // Agrego hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nomina");

    // Guardo archivo
    XLSX.writeFile(workbook, "nomina_consulta.xlsx");

    setShowSaveModal(false); // Cierro modal
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Consultar Nómina</h1>

      {/* FORMULARIO DE CONSULTA - Solo se muestra si aún no hay resultado */}
      {!resultado && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de identificación:</label>

            {/* Select para seleccionar tipo de documento */}
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
            <label style={styles.label}>Número de identificación:</label>

            {/* Input para escribir número de documento */}
            <input
              type="text"
              style={styles.input}
              value={idEmpleado}
              onChange={(e) => setIdEmpleado(e.target.value)}
            />
          </div>

          {/* Botones de consultar y cancelar */}
          <div style={styles.buttonsRow}>
            <button style={styles.buttonPrimary} onClick={handleSearch}>
              Consultar
            </button>

            <button
              style={styles.buttonCancel}
              onClick={() => navigate("/payroll")}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* RESULTADO DE LA CONSULTA */}
      {resultado && (
        <div style={styles.result}>
          <h2 style={styles.subtitle}>Resultado de la Nómina</h2>

          {/* Tabla con toda la información de la nómina */}
          <table style={styles.table} ref={tableRef}>
            <tbody>
              <tr>
                <th style={styles.th}>Empleado:</th>
                <td style={styles.td}>
                  {resultado.empleado.primerNombre} {resultado.empleado.segundoNombre}{" "}
                  {resultado.empleado.primerApellido} {resultado.empleado.segundoApellido}
                </td>
              </tr>

              <tr>
                <th style={styles.th}>Identificación:</th>
                <td style={styles.td}>
                  {resultado.empleado.tipoIdentificacion}{" "}
                  {resultado.empleado.identificacion}
                </td>
              </tr>

              <tr>
                <th style={styles.th}>Cargo:</th>
                <td style={styles.td}>{resultado.empleado.cargo}</td>
              </tr>

              <tr>
                <th style={styles.th}>Dependencia:</th>
                <td style={styles.td}>{resultado.empleado.dependencia}</td>
              </tr>

              <tr>
                <th style={styles.th}>Periodo:</th>
                <td style={styles.td}>{resultado.periodo}</td>
              </tr>

              <tr>
                <th style={styles.th}>Ingresos Totales:</th>
                <td style={styles.td}>${resultado.ingresos.toLocaleString()}</td>
              </tr>

              <tr>
                <th style={styles.th}>Deducciones:</th>
                <td style={styles.td}>${resultado.deducciones.toLocaleString()}</td>
              </tr>

              <tr>
                <th style={styles.thStrong}>Neto a Pagar:</th>
                <td style={styles.tdStrong}>${resultado.neto.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Botones para imprimir, guardar o volver */}
          <div style={styles.buttonsRow}>
            <button style={styles.buttonPrimary} onClick={() => window.print()}>
              Imprimir
            </button>

            <button
              style={styles.buttonSecondary}
              onClick={() => setShowSaveModal(true)}
            >
              Guardar Como…
            </button>

            <button
              style={styles.buttonCancel}
              onClick={() => setResultado(null)}
            >
              Volver
            </button>
          </div>
        </div>
      )}

      {/* MODAL PARA GUARDAR COMO */}
      {showSaveModal && (
        <div style={modal.overlay}>
          <div style={modal.box}>
            <h3 style={{ marginBottom: 15 }}>Guardar como...</h3>

            {/* Opciones como PDF o Excel */}
            <button style={modal.btn} onClick={guardarPDF}>
              PDF
            </button>

            <button style={modal.btn} onClick={guardarXLS}>
              XLS
            </button>

            <button
              style={modal.cancel}
              onClick={() => setShowSaveModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos en objeto
const styles = { /* ...se mantienen iguales... */ };
const modal = { /* ...se mantienen iguales... */ };

export default ConsultaNomina;
