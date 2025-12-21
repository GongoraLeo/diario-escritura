import { User } from '../models/User.js';
import {
    successResponse,
    errorResponse,
    notFoundResponse
} from '../utils/response.js';

/**
 * Obtener todos los usuarios (solo admin)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        return successResponse(res, {
            users,
            total: users.length
        }, 'Usuarios obtenidos exitosamente');
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return errorResponse(res, 'Error al obtener usuarios', 500);
    }
};

/**
 * Obtener un usuario específico por ID (solo admin)
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return notFoundResponse(res, 'Usuario no encontrado');
        }

        return successResponse(res, user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return errorResponse(res, 'Error al obtener usuario', 500);
    }
};

/**
 * Activar/Desactivar usuario (solo admin)
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        // No permitir que el admin se desactive a sí mismo
        if (id === req.user.id) {
            return errorResponse(res, 'No puedes desactivar tu propia cuenta', 400);
        }

        const user = await User.findById(id);
        if (!user) {
            return notFoundResponse(res, 'Usuario no encontrado');
        }

        await User.updateActiveStatus(id, is_active);

        return successResponse(res, {
            id,
            is_active
        }, `Usuario ${is_active ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        return errorResponse(res, 'Error al cambiar estado del usuario', 500);
    }
};

/**
 * Eliminar usuario (solo admin)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir que el admin se elimine a sí mismo
        if (id === req.user.id) {
            return errorResponse(res, 'No puedes eliminar tu propia cuenta', 400);
        }

        const user = await User.findById(id);
        if (!user) {
            return notFoundResponse(res, 'Usuario no encontrado');
        }

        await User.delete(id);

        return successResponse(res, null, 'Usuario eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return errorResponse(res, 'Error al eliminar usuario', 500);
    }
};

/**
 * Obtener estadísticas de usuarios (solo admin)
 */
export const getUserStats = async (req, res) => {
    try {
        const stats = await User.getStats();

        return successResponse(res, stats, 'Estadísticas obtenidas exitosamente');
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return errorResponse(res, 'Error al obtener estadísticas', 500);
    }
};
