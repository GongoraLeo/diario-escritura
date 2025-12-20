import { verifyToken } from '../utils/jwt.js';
import { unauthorizedResponse, forbiddenResponse } from '../utils/response.js';

/**
 * Middleware de autenticación
 * Verifica que el usuario tenga un token JWT válido
 */
export const authMiddleware = async (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'Token no proporcionado');
        }

        const token = authHeader.substring(7); // Remover 'Bearer '

        // Verificar token
        const decoded = verifyToken(token);

        // Agregar información del usuario al request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        return unauthorizedResponse(res, 'Token inválido o expirado');
    }
};

/**
 * Middleware de verificación de rol administrador
 * Debe usarse después del authMiddleware
 */
export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return forbiddenResponse(res, 'Acceso denegado. Se requieren permisos de administrador');
    }
    next();
};
