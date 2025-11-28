import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeUpdate() {
  const navigate = useNavigate();
  const { id } = useParams(); // aquí recibo el id del empleado desde la URL

  const [originalData, setOriginalData] = useState(null); // guardo los datos originales por si quiero deshacer
  const [formData, setFormData] = useState(null); // aquí manejo los datos editables del formulario

  // Al cargar el componente, busco el empleado y lleno el formulario
  useEffect(() => {
    const empleados = JSON.parse(localStorage.getItem("empleados")) || []; // saco los empleados del localStorage

    // aquí busco el empleado por su identificación
    const found = empleados.find((e) => e.identificacion === id);

    // si no aparece, regreso a la gestión de empleados
    if (!found) {
      alert("Empleado no encontrado.");
      navigate("/employees/manage");
      return;
    }

    // lleno los estados con los datos originales y los editables
    setOriginalData(found);
    setFormData({ ...found });
  }, [id, navigate]);

  // cada vez que cambia un campo del formulario actualizo formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // función para actualizar el empleado
  const handleUpdate = () => {
    // validación rápida para evitar campos vacíos
    if (
      !formData.tipoIdentificacion ||
      !formData.identificacion ||
      !formData.primerNombre ||
      !formData.primerApellido ||
      !formData.telefono ||
      !formData.direccion ||
      !formData.dependencia ||
      !formData.cargo ||
      !formData.salarioBase
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // traigo los empleados actuales
    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    // busco el índice del empleado que se va a actualizar
    const index = empleados.findIndex((e) => e.identificacion === id);

    // si no existe, aviso
    if (index === -1) {
      alert("Empleado no encontrado.");
      return;
    }

    // reemplazo la información en el array
    empleados[index] = { ...formData };

    // guardo los cambios
    localStorage.setItem("empleados", JSON.stringify(empleados));

    alert("Empleado actualizado correctamente.");
    navigate("/employees/manage");
  };

  // aquí vuelvo a poner los datos originales por si me arrepiento de lo editado
  const handleUndo = () => {
    setFormData({ ...originalData });
  };

  // botón para regresar
  const handleCancel = () => {
    navigate("/employees/manage");
  };

  // si los datos no han cargado aún, muestro esto
  if (!formData) return <h2>Cargando empleado...</h2>;

  return (
    <div style={styles.container}>
      <h1>Actualizar Empleado</h1>

      {/* FORMULARIO */}
      <div style={styles.formGroup}>
        <label>Tipo de Identificación:</label>
        <select
          style={styles.input}
          name="tipoIdentificacion"
          value={formData.tipoIdentificacion}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="Cédula">Cédula</option>
          <option value="Cédula de Extranjería">Cédula de extranjería</option>
          <option value="PPT">PPT</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="Salvoconducto">Salvoconducto</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>Número de Identificación:</label>
        {/* este campo va deshabilitado porque no se debe editar */}
        <input
          type="text"
          style={styles.input}
          name="identificacion"
          value={formData.identificacion}
          disabled
        />
      </div>

      <div style={styles.formGroup}>
        <label>Primer Nombre:</label>
        <input
          type="text"
          style={styles.input}
          name="primerNombre"
          value={formData.primerNombre}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Segundo Nombre:</label>
        <input
          type="text"
          style={styles.input}
          name="segundoNombre"
          value={formData.segundoNombre || ""}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Primer Apellido:</label>
        <input
          type="text"
          style={styles.input}
          name="primerApellido"
          value={formData.primerApellido}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Segundo Apellido:</label>
        <input
          type="text"
          style={styles.input}
          name="segundoApellido"
          value={formData.segundoApellido || ""}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Teléfono:</label>
        <input
          type="text"
          style={styles.input}
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Dirección:</label>
        <input
          type="text"
          style={styles.input}
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Dependencia:</label>
        <input
          type="text"
          style={styles.input}
          name="dependencia"
          value={formData.dependencia}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Cargo:</label>
        <input
          type="text"
          style={styles.input}
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Salario Base:</label>
        <input
          type="number"
          style={styles.input}
          name="salarioBase"
          value={formData.salarioBase}
          onChange={handleChange}
        />
      </div>

      {/* BOTONES */}
      <div style={styles.buttonsRow}>
        <button style={styles.button} onClick={handleUpdate}>
          Actualizar Empleado
        </button>

        <button style={styles.buttonSecondary} onClick={handleUndo}>
          Deshacer Cambios
        </button>

        <button style={styles.buttonCancel} onClick={handleCancel}>
          Cancelar
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
    marginTop: 30,
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
};

export default EmployeeUpdate;
