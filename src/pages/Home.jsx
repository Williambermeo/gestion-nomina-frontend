import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";   // Uso useNavigate para poder redirigir después del login
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";  // Logo que agregué para que aparezca en la pantalla de inicio de sesión
import "./styles/Home.css";

function Home() {
  // Estados para capturar usuario y contraseña ingresados en el formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Consumo el contexto de autenticación para saber si hay usuario logueado y para usar la función login
  const { user, login } = useContext(AuthContext);

  // Estado para mostrar mensaje de error si las credenciales no son correctas
  const [error, setError] = useState("");

  // Hook para manejar navegación entre rutas
  const navigate = useNavigate();

  // Función que se ejecuta cuando el usuario envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evito recarga de la página

    const success = login(username, password); // Llamo la función login del contexto

    // Si falla, muestro error
    if (!success) {
      setError("Usuario o contraseña incorrectos");
    } else {
      // Si es correcto, limpio el error y redirijo al dashboard
      setError("");
      navigate("/dashboard");
    }
  };

  // Si ya hay un usuario logueado (por ejemplo al recargar), lo envío directo al dashboard
  if (user) {
    navigate("/dashboard");
    return null; // Evito que se renderice la vista de login mientras redirige
  }

  return (
    <div className="home-container">
      {/* Muestro el logo de la aplicación en la parte superior */}
      <img src={logo} alt="Logo Gestión de Nómina" className="home-logo-image" />

      <h2 className="home-welcome-text">
        Bienvenido, por favor inicia sesión
      </h2>

      {/* Formulario de inicio de sesión */}
      <form onSubmit={handleSubmit} className="home-form">

        {/* Campo para el usuario */}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Guardo el valor escrito
          className="home-input"
          required
        />

        {/* Campo para la contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Guardo la contraseña
          className="home-input"
          required
        />

        {/* Si hay error lo muestro en pantalla */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Botón para enviar el formulario */}
        <button type="submit" className="home-button">
          Ingresar
        </button>

      </form>
    </div>
  );
}

export default Home;
