Gestión de Nómina – Frontend (React)



Aplicación web desarrollada con React para la gestión integral de la nómina empresarial.

Permite registrar empleados, calcular sueldos según parámetros definidos, generar reportes en PDF/Excel, administrar registros y facilitar la operatividad del proceso de nómina.



Evidencia de producto: GA7-220501096-AA4-EV03 Componente frontend del proyecto formativo y

proyectos de clase (listas de chequeo)



Tecnologías utilizadas



React JS

React Router DOM

JavaScript ES6

CSS / Tailwind / Estilos propios

jsPDF (generación de documentos PDF)

XLSX.js (exportación a Excel)

Vite (entorno de desarrollo)



Estructura del proyecto



gestion-nomina-frontend/

&nbsp;├── public/

&nbsp;├── src/

&nbsp;│   ├── components/

&nbsp;│   ├── pages/

&nbsp;│   ├── hooks/

&nbsp;│   ├── assets/

&nbsp;│   ├── App.js

&nbsp;│   └── main.jsx

&nbsp;├── .gitignore

&nbsp;├── package.json

&nbsp;├── vite.config.js

&nbsp;└── README.md



Funcionalidades principales

✔ Gestión de empleados



Registrar empleados



Editar información básica



Consultar registros



Eliminar empleados del sistema



✔ Cálculo de nómina



Incluye:



Sueldo base



Horas extras



Comisión del 2% por ventas superiores a $10.000.000 COP



Detalle del cálculo paso a paso



Total devengado



✔ Generación de documentos



PDF con jsPDF



Excel (.xlsx) con XLSX.js



✔ Interfaz amigable



Navegación rápida con React Router



Formularios simples y validados



Diseño adaptable



Instalación del proyecto

1- Clonar el repositorio

git clone https://github.com/Williambermeo/gestion-nomina-frontend.git

2- Entrar a la carpeta

cd gestion-nomina-frontend

3- Instalar dependencias

npm install

4- Ejecutar en modo desarrollo

npm run dev

El proyecto quedará disponible en: http://localhost:5173

Build para producción: npm run build

Archivos finales en:/dist

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Manual rápido de uso

1\. Módulo de empleados



Ingrese al menú "Empleados"



Registre nuevos empleados llenando el formulario



Puede editar o eliminar registros



2\. Módulo de nómina



Se selecciona un empleado



Ingrese horas extras según corresponda



Ingrese valor de ventas si aplica comisión



El sistema calcula:



Devengado



Comisiones



Total neto



3\. Exportar reportes



Botón Generar PDF



Botón Exportar Excel









Autor



William Esteban Bermeo Leyton

Estudiante de Tecnología en Análisis y Desarrollo de Software – SENA

FICHA: 2977355

GitHub: https://github.com/Williambermeo
https://github.com/Williambermeo/gestion-nomina-frontend

