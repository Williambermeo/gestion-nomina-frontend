import React, { createContext, useState } from "react";

// Creo el contexto de autenticación para poder compartir el usuario
// y las funciones de login/logout con todo el sistema.
export const AuthContext = createContext();

// Componente proveedor del contexto, aquí guardo y manejo el estado del usuario.
export function AuthProvider({ children }) {

  // Guardo al usuario autenticado. Cuando está en null significa que nadie ha iniciado sesión.
  const [user, setUser] = useState(null);

  // Esta función la uso para validar el inicio de sesión. Por ahora acepto cualquier usuario
  // que ingrese nombre y contraseña, porque la actividad no exige conexión con backend.
  const login = (username, password) => {
    if (username && password) {
      // Cuando el usuario inicia sesión, guardo su nombre para usarlo en el sistema.
      setUser({ username });
      return true; // Indico que el login fue exitoso.
    }
    return false; // El login falla si algún campo viene vacío.
  };

  // Esta función la uso para cerrar la sesión del usuario. Simplemente vuelvo el estado a null.
  const logout = () => {
    setUser(null);
  };

  // Retorno el proveedor, enviando los valores y funciones a cualquier componente que los necesite.
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
