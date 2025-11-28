import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importación de las páginas del sistema para usarlas como rutas
import Home from "../pages/Home";
import EmployeeManagement from "../pages/EmployeeManagement";
import EmployeeCreate from "../pages/EmployeeCreate";
import EmployeeUpdate from "../pages/EmployeeUpdate";
import EmployeeDelete from "../pages/EmployeeDelete";
import EmployeeSearch from "../pages/EmployeeSearch";
import SearchEmployee from "../pages/SearchEmployee";
import EmployeeList from "../pages/EmployeeList";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import PayrollManagement from "../pages/PayrollManagement";
import PayrollCalculate from "../pages/PayrollCalculate";
import PayrollConsult from "../pages/PayrollConsult";
import SalesManagement from "../pages/SalesManagement";
import SalesRegister from "../pages/SalesRegister";
import SalesConsult from "../pages/SalesConsult";
import OvertimeManagement from "../pages/OvertimeManagement"; // Página nueva para gestión de horas extra

function AppRouter() {
  return (
    // Envolviendo toda la app dentro del BrowserRouter para manejar rutas
    <BrowserRouter>
      {/* Definición de todas las rutas del sistema */}
      <Routes>

        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Rutas relacionadas con empleados */}
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/employees/create" element={<EmployeeCreate />} />

        {/* Ruta dinámica para actualizar usando el ID */}
        <Route path="/employees/update/:id" element={<EmployeeUpdate />} />

        {/* Ruta dinámica para eliminar empleado */}
        <Route path="/employees/delete/:id" element={<EmployeeDelete />} />

        {/* Buscador general de empleados */}
        <Route path="/employees/search" element={<EmployeeSearch />} />

        {/* Lista completa de empleados */}
        <Route path="/employees/list" element={<EmployeeList />} />

        {/* Página de autenticación */}
        <Route path="/login" element={<Login />} />

        {/* Pantalla principal después de iniciar sesión */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Ruta alternativa hacia gestión de empleados */}
        <Route path="/employees/manage" element={<EmployeeManagement />} />

        {/* Rutas relacionadas con nómina */}
        <Route path="/payroll" element={<PayrollManagement />} />
        <Route path="/payroll/calculate" element={<PayrollCalculate />} />
        <Route path="/payroll/consult" element={<PayrollConsult />} />

        {/* Rutas relacionadas con ventas */}
        <Route path="/sales" element={<SalesManagement />} />
        <Route path="/sales/register" element={<SalesRegister />} />
        <Route path="/sales/consult" element={<SalesConsult />} />

        {/* Nueva ruta para la sección de horas extra */}
        <Route path="/overtime" element={<OvertimeManagement />} />

        {/* Ruta para cualquier URL que no exista */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
