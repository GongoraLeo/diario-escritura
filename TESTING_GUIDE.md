# 🧪 Guía Paso a Paso para Probar el Backend

## Requisitos Previos

1. ✅ XAMPP corriendo (MySQL activo)
2. ✅ Base de datos `diario_escritura` creada e importado el schema.sql
3. ✅ Servidor backend corriendo: `npm run dev` en `/backend`

---

## Método 1: Thunder Client (Recomendado)

### Paso 1: Instalar Thunder Client

1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "Thunder Client"
4. Click en "Install"

### Paso 2: Importar la Colección

1. En VS Code, click en el ícono del rayo ⚡ (Thunder Client) en la barra lateral
2. Click en "Collections"
3. Click en los tres puntos ⋮ → "Import"
4. Selecciona el archivo: `thunder-collection.json` (está en la raíz del proyecto)

### Paso 3: Probar el Flujo Completo

#### 3.1 Registrar un Usuario

1. En Thunder Client, abre la colección "Diario de Escritura API"
2. Carpeta "1. Autenticación" → "Registro de Usuario"
3. Click en "Send"
4. ✅ Deberías recibir un `token` en la respuesta
5. **COPIA EL TOKEN** (lo necesitarás para los siguientes pasos)

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid-generado",
      "username": "escritor1",
      "email": "escritor1@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

#### 3.2 Configurar el Token en el Environment

1. En Thunder Client, click en "Env" (arriba a la derecha)
2. Selecciona "Local"
3. En la variable `token`, pega el token que copiaste
4. Click en "Save"

Ahora todas las peticiones usarán automáticamente este token con `{{token}}`

#### 3.3 Crear una Novela

1. Carpeta "2. Novelas" → "Crear Novela"
2. Click en "Send"
3. ✅ Recibirás los datos de la novela creada
4. **COPIA EL `id` DE LA NOVELA**

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Novela creada exitosamente",
  "data": {
    "id": "uuid-de-la-novela",
    "user_id": "...",
    "title": "El Señor de los Anillos",
    "description": "Una épica aventura en la Tierra Media",
    "word_count": 0,
    "created_at": "2025-12-21T..."
  }
}
```

#### 3.4 Configurar el ID de la Novela

1. En "Env" → "Local"
2. En la variable `novelId`, pega el ID de la novela
3. Click en "Save"

#### 3.5 Crear un Personaje

1. Carpeta "3. Personajes" → "Crear Personaje"
2. Click en "Send"
3. ✅ El personaje se creará con todas sus secciones

#### 3.6 Crear una Trama

1. Carpeta "4. Tramas" → "Crear/Actualizar Trama"
2. Click en "Send"
3. ✅ La trama se guardará con la estructura de 3 actos

#### 3.7 Obtener Todo

- "Obtener Mis Novelas" → Ver todas tus novelas
- "Obtener Personajes de Novela" → Ver personajes
- "Obtener Perfil" → Ver tu perfil de usuario

---

## Método 2: Manualmente (sin colección)

### Paso 1: Abrir Thunder Client

1. Click en el ícono del rayo ⚡
2. Click en "New Request"

### Paso 2: Registro

- **Método**: POST
- **URL**: `http://localhost:3000/api/auth/register`
- **Headers**: 
  - Content-Type: `application/json`
- **Body** (selecciona JSON):
```json
{
  "username": "escritor1",
  "email": "escritor1@example.com",
  "password": "password123",
  "full_name": "Juan Escritor"
}
```
- Click "Send"

### Paso 3: Login

- **Método**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Body**:
```json
{
  "email": "escritor1@example.com",
  "password": "password123"
}
```
- Copia el `token` de la respuesta

### Paso 4: Crear Novela (con token)

- **Método**: POST
- **URL**: `http://localhost:3000/api/novels`
- **Headers**:
  - Content-Type: `application/json`
  - Authorization: `Bearer {pega-aqui-tu-token}`
- **Body**:
```json
{
  "title": "Mi Primera Novela",
  "description": "Una historia increíble"
}
```

---

## 🔍 Verificar que Todo Funciona

### Test Rápido en el Navegador

1. Abre: `http://localhost:3000/`
2. Deberías ver:
```json
{
  "message": "✅ API de Diario de Escritura funcionando",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "admin": "/api/admin",
    "novels": "/api/novels",
    ...
  }
}
```

### Verificar Base de Datos

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `diario_escritura`
3. Ve a la tabla `users` → deberías ver tu usuario registrado
4. Ve a la tabla `novels` → deberías ver tu novela

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"
- ✅ Verifica que XAMPP esté corriendo
- ✅ Verifica que MySQL esté activo en XAMPP
- ✅ Revisa el archivo `.env` en `/backend`

### Error: "Token inválido"
- ✅ Asegúrate de incluir "Bearer " antes del token
- ✅ Formato correcto: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Error: "Novela no encontrada"
- ✅ Verifica que el `novelId` sea correcto
- ✅ Asegúrate de que la novela pertenezca al usuario autenticado

### Error: "No autorizado"
- ✅ Verifica que el token sea válido
- ✅ El token expira en 7 días, haz login de nuevo si es necesario

---

## 📝 Notas Importantes

1. **El servidor debe estar corriendo**: `npm run dev` en `/backend`
2. **MySQL debe estar activo** en XAMPP
3. **Los tokens expiran** en 7 días
4. **Cada usuario solo ve sus propias novelas** (excepto admin)
5. **El admin puede ver todo** (usuario: admin, password: admin123)

---

## 🎯 Flujo Completo Recomendado

1. ✅ Registrarse
2. ✅ Login (obtener token)
3. ✅ Crear novela
4. ✅ Crear personajes
5. ✅ Crear trama
6. ✅ Crear escenas
7. ✅ Crear pistas de timeline
8. ✅ Crear eventos en timeline
9. ✅ Crear apuntes

¡Listo para probar! 🚀
