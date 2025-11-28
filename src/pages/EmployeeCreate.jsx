import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EmployeeCreate() {
  const navigate = useNavigate();

  // Obtengo el usuario actual para registrar quién creó el empleado.
  const { user } = useContext(AuthContext);

  // Estado inicial del formulario, aquí dejo todos los campos vacíos.
  const initialFormState = {
    tipoIdentificacion: "",
    identificacion: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    telefono: "",
    direccion: "",
    dependencia: "",
    cargo: "",
    salarioBase: "",
  };

  // Estado donde guardo temporalmente todos los datos del formulario.
  const [form, setForm] = useState(initialFormState);

  // Cada vez que un input cambia, actualizo el estado correspondiente.
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Validación simple para asegurar que los campos obligatorios no queden vacíos.
  const validateForm = () => {
    if (
      !form.tipoIdentificacion ||
      !form.identificacion ||
      !form.primerNombre ||
      !form.primerApellido ||
      !form.telefono ||
      !form.direccion ||
      !form.dependencia ||
      !form.cargo ||
      !form.salarioBase
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return false;
    }
    return true;
  };

  // Esta función se ejecuta cuando intento crear un nuevo empleado.
  const handleCreate = (e) => {
    e.preventDefault();

    // Primero valido que el formulario esté completo.
    if (!validateForm()) return;

    // Armo el objeto final del empleado, agrego la fecha y el usuario que lo crea.
    const empleadoFinal = {
      ...form,
      fechaCreacion: new Date().toISOString(), // Guardo la fecha exacta en la que se crea el registro
      usuarioCreacion: user?.username || "Desconocido", // Guardo quién creó el empleado
    };

    // Obtengo los empleados almacenados para anexar el nuevo.
    const empleadosGuardados = JSON.parse(localStorage.getItem("empleados")) || [];

    // Reviso si ya existe un empleado con el mismo tipo y número de identificación.
    const existeEmpleado = empleadosGuardados.some(
      (emp) =>
        emp.tipoIdentificacion === empleadoFinal.tipoIdentificacion &&
        emp.identificacion === empleadoFinal.identificacion
    );

    // Si ya existe, muestro el aviso y cancelo la creación.
    if (existeEmpleado) {
      alert("El empleado ya está registrado.");
      return;
    }

    // Si no existe, lo agrego a la lista y lo guardo nuevamente en localStorage.
    empleadosGuardados.push(empleadoFinal);
    localStorage.setItem("empleados", JSON.stringify(empleadosGuardados));

    console.log("Empleado creado:", empleadoFinal);
    alert("Empleado creado exitosamente.");

    // Limpio el formulario después de crear el empleado.
    setForm(initialFormState);

    // Regreso a la pantalla de gestión de empleados.
    navigate("/employees/manage");
  };

  // Limpia todos los campos del formulario.
  const handleClear = () => setForm(initialFormState);

  // Cancela la creación y vuelve a la pantalla anterior.
  const handleCancel = () => {
    setForm(initialFormState);
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <h1>Crear Empleado</h1>

      <form style={styles.form} onSubmit={handleCreate}>
        {/* Selección del tipo de identificación */}
        <label style={styles.label}>Tipo de Identificación *</label>
        <select
          name="tipoIdentificacion"
          value={form.tipoIdentificacion}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Seleccione...</option>
          <option value="Cédula">Cédula</option>
          <option value="Cédula de Extranjería">Cédula de Extranjería</option>
          <option value="PPT">PPT</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="Salvoconducto">Salvoconducto de Permanencia</option>
        </select>

        {/* Campos básicos de identificación */}
        <label style={styles.label}>Número de Identificación *</label>
        <input
          type="text"
          name="identificacion"
          value={form.identificacion}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Primer Nombre *</label>
        <input
          type="text"
          name="primerNombre"
          value={form.primerNombre}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Segundo Nombre</label>
        <input
          type="text"
          name="segundoNombre"
          value={form.segundoNombre}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Primer Apellido *</label>
        <input
          type="text"
          name="primerApellido"
          value={form.primerApellido}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Segundo Apellido</label>
        <input
          type="text"
          name="segundoApellido"
          value={form.segundoApellido}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Información de contacto */}
        <label style={styles.label}>Teléfono *</label>
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Dirección *</label>
        <input
          type="text"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Información laboral */}
        <label style={styles.label}>Dependencia *</label>
        <input
          type="text"
          name="dependencia"
          value={form.dependencia}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Cargo *</label>
        <input
          type="text"
          name="cargo"
          value={form.cargo}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Salario Base *</label>
        <input
          type="number"
          name="salarioBase"
          value={form.salarioBase}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Botones de acción del formulario */}
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.createButton}>
            Crear
          </button>

          <button type="button" style={styles.clearButton} onClick={handleClear}>
            Limpiar
          </button>

          <button type="button" style={styles.cancelButton} onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  // Contenedor principal del formulario
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
  },

  // Estilo del formulario en columna
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginTop: 30,
  },

  // Estilo de las etiquetas
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Estilo de los inputs
  input: {
    padding: "10px",
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
  },

  // Contenedor para los botones inferiores
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  },

  // Botón para crear el empleado
  createButton: {
    backgroundColor: "#4caf50",
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },

  // Botón para limpiar campos
  clearButton: {
    backgroundColor: "#ff9800",
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },

  // Botón para cancelar
  cancelButton: {
    backgroundColor: "#c62828",
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default EmployeeCreate;
