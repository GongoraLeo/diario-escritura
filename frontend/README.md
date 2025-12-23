# Diario de Escritura - Frontend

Frontend de la aplicación de escritura de novelas construido con Astro + React + Tailwind CSS.

## 🚀 Tecnologías

- **Astro 4.x** - Framework principal
- **React 18** - Componentes interactivos
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Zustand** - Estado global (opcional)

## 📦 Instalación

```bash
cd frontend
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## 🏗️ Estructura

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   ├── layouts/         # Layouts de Astro
│   ├── pages/           # Páginas de Astro
│   ├── services/        # Servicios de API
│   ├── styles/          # Estilos globales
│   └── types/           # Tipos TypeScript
├── public/              # Archivos estáticos
└── astro.config.mjs     # Configuración de Astro
```

## 📄 Páginas Disponibles

- `/` - Redirige a login
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/dashboard` - Panel principal (requiere autenticación)

## 🔐 Autenticación

El frontend se comunica con el backend en `http://localhost:3000/api`

Los tokens JWT se almacenan en localStorage y se envían automáticamente en cada petición.

## 🎨 Paleta de Colores

- **Primary**: Púrpura (#8b5cf6)
- **Accent**: Verde azulado (#10b981)
- **Warm**: Naranja (#f97316)
