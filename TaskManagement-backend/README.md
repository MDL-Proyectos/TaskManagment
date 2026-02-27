# TaskManagement-Backend

## 📋 Descripción General

Sistema backend de API REST para una aplicación de gestión de tareas. Construido con **Node.js**, **Express.js** y **MongoDB**, proporciona un conjunto completo de endpoints para autenticación, gestión de usuarios, tareas, proyectos y equipos.

---

## 🗂️ Estructura de Directorios

### 📁 Directorio Raíz

Archivos de configuración principal de la aplicación:

- **`app.js`** - Archivo principal de configuración de Express
  - Configuración de middlewares (CORS, logger, parser)
  - Registro de rutas
  - Importa y usa middlewares de autenticación y autorización

- **`bin/www.js`** - Punto de entrada de la aplicación
  - Inicialización del servidor HTTP
  - Conexión a la base de datos MongoDB
  - Configuración del puerto y variables de entorno
  - Muestra información del servidor al iniciar (usando Figlet)

- **`package.json`** - Definición del proyecto y dependencias
  - **Nombre:** TaskManagement-API
  - **Versión:** 0.0.0
  - **Tipo:** ES Module (`"type": "module"`)
  - **Scripts:**
    - `start`: Ejecuta el servidor
    - `dev`: Ejecuta el servidor en modo desarrollo con nodemon
    - `prettify`: Formatea el código con Prettier
    - `lint`: Valida el código con ESLint
    - `migrate`: Ejecuta migraciones de base de datos
    - `migrate-dev`: Ejecuta migraciones en modo desarrollo

- **`package-lock.json`** - Lock file de las dependencias

---


### 📄 `.gitignore`
Archivos y directorios ignorados por Git (dependencias, logs, archivos de entorno, etc.)

### 📄 `.prettierrc`
Configuración de Prettier para formateo de código

### 📄 `eslint.config.js`
Configuración de ESLint:
- Usa configuración recomendada de @eslint/js
- Soporta ES6+ import/export
- Incluye configuración comentada para TypeScript

### 📄 `migrate-mongo-config.js`
Configuración para migraciones de MongoDB:
- URL de conexión: Se obtiene de variables de entorno
- Directorio de migraciones: `migrations/`
- Sistema de módulos: ESM (ES Modules)
- Colección de changelog: `changelog`

---

## 📡 Rutas y Endpoints

La aplicación está organizada por módulos de rutas:

### 🔐 Rutas de Autenticación
- **`/auth`** - Autenticación
  - Login, registro, validación de tokens

### 👤 Rutas de Usuarios
- **`/users`** - Gestión de usuarios (Requiere autenticación)
  - CRUD de usuarios
  - Perfil de usuario

### 📝 Rutas de Tareas
- **`/task`** - Gestión de tareas (Requiere autenticación)
  - CRUD de tareas
  - Asignación de tareas

### 📊 Rutas de Proyectos de Tareas
- **`/taskProject`** - Gestión de proyectos (Requiere autenticación)
  - CRUD de proyectos
  - Organización de tareas por proyecto

### 👥 Rutas de Equipos
- **`/teams`** - Gestión de equipos (Requiere autenticación)
  - CRUD de equipos
  - Gestión de miembros

### 🎯 Rutas de Roles
- **`/roles`** - Gestión de roles (Requiere autenticación)
  - CRUD de roles
  - Asignación de permisos

### ℹ️ Rutas de Estado
- **`/`** - Status de la API
  - `GET /` - Información de la API (nombre, versión, entorno)
  - `GET /status` - Estado del servidor

---

## 🔒 Middlewares

### `middlewares/authentication.js`
Middleware de autenticación JWT:
- Valida tokens Bearer en el header `Authorization`
- Verifica la firma del token
- Extrae información del usuario (_id y role)
- Maneja errores de token expirado
- Registra intentos de acceso sospechosos
- **Nota:** Actualmente usa autenticación insegura (secreto simple). Comentado el código para usar RS256 con clave pública

### `middlewares/authorization.js`
Middleware de autorización:
- Valida permisos según el rol del usuario
- Controla el acceso a recursos específicos

---

## 🛠️ Utilidades

### `utils/logger.js`
Sistema de logging usando Winston:
- Logging de información, advertencias y errores
- Integración con Morgan para logs HTTP
- Registro en archivos y consola

---

## 📝 Modelos y Esquemas

### `schemas/`
Define los esquemas de Mongoose para:
- Usuarios (User)
- Tareas (Task)
- Proyectos de Tareas (TaskProject)
- Equipos (Team)
- Roles (Role)

*(Estructura específica de los esquemas disponible en los archivos dentro de `schemas/`)*

---

## 🚀 Base de Datos

### Migraciones
La carpeta `migrations/` contiene scripts de migración para:
- Creación de colecciones iniciales
- Inserción de datos de prueba
- Cambios en la estructura de datos
