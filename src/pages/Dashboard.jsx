import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Importo el logo para mostrarlo en la pantalla

function Dashboard() {
  // Obtengo al usuario autenticado y la función de logout desde el contexto
  const { user, logout } = useContext(AuthContext);

  // Uso useNavigate para moverme entre las rutas del sistema
  const navigate = useNavigate();

  // Esta función la uso cuando el usuario quiere cerrar sesión
  // Limpio el usuario y regreso a la pantalla de login
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Esta función la utilizo para navegar a cualquier ruta que necesite
  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      {/* Muestro el logo en la parte superior de la dashboard */}
      <img src={logo} alt="Logo Gestión de Nómina" style={styles.logo} />

      {/* Mensaje de bienvenida usando el nombre del usuario que inició sesión */}
      <h1>Bienvenido a la Dashboard, {user?.username}</h1>

      {/* Contenedor donde ubico los botones principales para navegar entre módulos */}
      <div style={styles.buttonsContainer}>
        <button
          style={styles.button}
          onClick={() => goTo("/employees/manage")}  // Redirige al módulo de empleados
        >
          Gestión de Empleados
        </button>

        <button
          style={styles.button}
          onClick={() => goTo("/payroll")}
        >
          Gestión de Nómina
        </button>

        <button
          style={styles.button}
          onClick={() => goTo("/sales")}
        >
          Gestión de Ventas
        </button>

        {/* Botón para ir al módulo donde manejo las horas extras */}
        <button
          style={styles.button}
          onClick={() => goTo("/overtime")}
        >
          Gestión de Horas Extras
        </button>
      </div>

      {/* Botón para cerrar sesión */}
      <button style={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}

const styles = {
  // Estilos principales del contenedor de la dashboard
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 30,
  },
  // Estilo del logo de la empresa
  logo: {
    width: 120,
    height: "auto",
    marginBottom: 20,
  },
  // Contenedor que organiza los botones verticalmente
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    width: "100%",
    maxWidth: 300,
  },
  // Estilo base que uso para los botones principales
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
  // Estilo del botón para cerrar sesión
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 40,
  },
};

export default Dashboard;
