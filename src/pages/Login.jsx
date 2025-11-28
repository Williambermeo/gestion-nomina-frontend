import React from "react";

/**
 * Componente para el inicio de sesión de usuarios en la aplicación.
 * Contiene un formulario básico para capturar usuario y contraseña.
 * Aquí se implementará la lógica de autenticación.
 */
export default function Login() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form>
        <label>
          Usuario:
          <input type="text" />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" />
        </label>
        <br />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
