import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "../routes/AppRouter";
import { AuthProvider } from "../context/AuthContext";

// Aquí renderizo toda la aplicación. Uso createRoot porque es la forma
// actual de iniciar React con la nueva API.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Envuelo toda la app dentro del AuthProvider para que las pantallas
        puedan acceder al usuario y las funciones de login y logout. */}
    <AuthProvider>
      {/* AppRouter es el componente que contiene todas las rutas de mi aplicación */}
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
