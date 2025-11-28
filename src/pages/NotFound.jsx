import React from "react";

/**
 * Componente que se muestra cuando el usuario navega a una ruta
 * que no existe dentro de la aplicación (Error 404).
 */
export default function NotFound() {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
    </div>
  );
}
