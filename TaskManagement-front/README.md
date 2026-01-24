# TaskManagement - Gestión de tareas y equipos

**TaskManagement** es una aplicación robusta para la gestión de tareas y equipos. Diseñada con una arquitectura desacoplada (Front-end y Back-end), permite a los usuarios organizar su flujo de trabajo, mientras que los perfiles de **Management** tienen herramientas avanzadas para administrar proyectos, usuarios y roles. 
La aplicación es parte del proyecto final de la materia Progración III - INSPT - UTN.

---

## Características Principales

* **Home-Dashboard:** Resumen visual en la Home con indicadores clave (Tareas totales, Completadas, Pendientes y En Progreso).
* **Gestión de Tareas:** Listado y administración de tareas personales con estados dinámicos.
* **Módulo de Management:**
    * **Proyectos:** Agrupación lógica de tareas por objetivos.
    * **Administración de Usuarios:** Gestión integral de cuentas, asignación de equipos y roles.
    * **Administración de Equipos:** Creción de equipos.
    * **Administración de Roles:** Gestión roles.
* **Seguridad:** * Autenticación basada en **JWT (JSON Web Tokens)**.
    * Protección de datos sensibles mediante variables de entorno.

---

## Stack Tecnológico

### **Frontend (Vite + React)**
* **Vite:** Herramienta para un desarrollo ultra rápido.
* **TypeScript:** Tipado estricto para reducir errores en tiempo de ejecución.
* **Ant Design (antd):** Sistema de diseño y componentes UI.
* **Axios:** Gestión de peticiones HTTP.

### **Backend (Node.js)**
* **Express:** Framework minimalista para la API REST.
* **MongoDB:** Base de datos NoSQL para persistencia de datos.
* **DayJS:** Manipulación eficiente de fechas (almacenamiento en ISO y visualización personalizada).

---

## Configuración de Entorno

El proyecto separa las configuraciones mediante archivos `.env`. Es fundamental seguir estas nomenclaturas:

### **Backend (`/TASKMANAGEMENT-BACK/.env`)**
### Archivo: `.env`
```env
PORT=4000
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
```

### **Frontend (`/TASKMANAGEMENT-FRONT/.env`)**
Para que el Frontend se comunique con el Backend, es obligatorio crear un archivo de configuración en la raíz de la carpeta `/frontend`:

### Archivo: `.env.local`
```env
# Importante: Vite requiere que las variables inicien con el prefijo VITE_
VITE_API_URL=http://localhost: