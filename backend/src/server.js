import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config.js';

// Importar rutas
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: '✅ API de Diario de Escritura funcionando',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            novels: '/api/novels'
        }
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(config.env === 'development' && { stack: err.stack })
    });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📝 Entorno: ${config.env}\n`);
});

export default app;
