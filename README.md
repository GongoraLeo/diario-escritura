# Diario de Escritura - Aplicación para Escritores de Novelas

Aplicación web completa para la planificación y escritura de novelas, con gestión de múltiples proyectos, fichas de personajes, estructuras de trama, escaletas, líneas de tiempo interactivas y editor de texto enriquecido.

## 🚀 Stack Tecnológico

### Backend
- Node.js 20.x + Express.js
- MySQL 8.x (XAMPP)
- JWT para autenticación
- bcryptjs para hash de contraseñas

### Frontend
- Astro 4.x (SSG/SSR híbrido)
- React 18 (componentes interactivos)
- TypeScript
- Tailwind CSS

## 📋 Características

- ✅ Sistema de autenticación (registro/login)
- ✅ Roles de usuario (usuario/administrador)
- ✅ Panel de administración
- ✅ Gestión de múltiples novelas
- ✅ Fichas completas de personajes (10 secciones)
- ✅ 6 estructuras de trama (3 actos, 5 actos, Viaje del Héroe, Save the Cat, Círculo de Historia, Trama Libre)
- ✅ Escaleta de escenas detallada
- ✅ Líneas de tiempo interactivas con drag & drop
- ✅ Editor de texto enriquecido
- ✅ Apuntes de estilo y argumentales
- ✅ Estadísticas de escritura

## 🛠️ Instalación

### Requisitos Previos
- Node.js 20.x o superior
- XAMPP con MySQL
- npm

### Configuración del Backend

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Copiar el archivo de configuración:
```bash
copy .env.example .env
```

3. Editar `.env` con tus credenciales de MySQL

4. Instalar dependencias:
```bash
npm install
```

5. Crear la base de datos:
- Abrir phpMyAdmin (http://localhost/phpmyadmin)
- Importar el archivo `database/schema.sql`

6. Iniciar el servidor:
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### Configuración del Frontend

(Próximamente)

## 📁 Estructura del Proyecto

```
diario-escritura/
├── backend/          # API Node.js + Express
├── frontend/         # Aplicación Astro + React
└── database/         # Esquemas SQL
```

## 🔐 Usuario Administrador por Defecto

- **Usuario**: admin
- **Contraseña**: admin123
- **Email**: admin@diario-escritura.local

> ⚠️ **Importante**: Cambiar la contraseña del administrador en producción

## 📝 Desarrollo

### Backend
```bash
cd backend
npm run dev  # Modo desarrollo con nodemon
```

### Frontend
```bash
cd frontend
npm run dev  # Modo desarrollo con Astro
```

## 🤝 Contribución

Este es un proyecto personal de desarrollo.

## 📄 Licencia

MIT
