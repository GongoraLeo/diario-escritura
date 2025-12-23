import { z } from 'zod';
import { Novel } from '../models/Novel.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

// Esquemas de validación
const createNovelSchema = z.object({
    title: z.string().min(1, 'El título es requerido').max(255),
    description: z.string().optional(),
    cover_image: z.string().url('URL de imagen inválida').optional().or(z.literal(''))
});


const updateNovelSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    cover_image: z.string().url().optional().or(z.literal(''))
});

/**
 * Crear una nueva novela
 */
export const createNovel = async (req, res) => {
    try {
        const validatedData = createNovelSchema.parse(req.body);

        const novelId = await Novel.create({
            user_id: req.user.id,
            ...validatedData
        });

        const novel = await Novel.findById(novelId);

        return successResponse(
            res,
            novel,
            'Novela creada exitosamente',
            201
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear novela:', error);
        return errorResponse(res, 'Error al crear novela', 500);
    }
};

/**
 * Obtener todas las novelas del usuario autenticado
 */
export const getUserNovels = async (req, res) => {
    try {
        const novels = await Novel.findByUserId(req.user.id);

        return successResponse(res, {
            novels,
            total: novels.length
        });
    } catch (error) {
        console.error('Error al obtener novelas:', error);
        return errorResponse(res, 'Error al obtener novelas', 500);
    }
};

/**
 * Obtener una novela específica
 */
export const getNovelById = async (req, res) => {
    try {
        const { id } = req.params;
        const novel = await Novel.findById(id);

        if (!novel) {
            return notFoundResponse(res, 'Novela no encontrada');
        }

        // Verificar que la novela pertenezca al usuario
        if (novel.user_id !== req.user.id && req.user.role !== 'admin') {
            return forbiddenResponse(res, 'No tienes permiso para acceder a esta novela');
        }

        return successResponse(res, novel);
    } catch (error) {
        console.error('Error al obtener novela:', error);
        return errorResponse(res, 'Error al obtener novela', 500);
    }
};

/**
 * Actualizar una novela
 */
export const updateNovel = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateNovelSchema.parse(req.body);

        const novel = await Novel.findById(id);
        if (!novel) {
            return notFoundResponse(res, 'Novela no encontrada');
        }

        // Verificar propiedad
        if (novel.user_id !== req.user.id && req.user.role !== 'admin') {
            return forbiddenResponse(res, 'No tienes permiso para modificar esta novela');
        }

        await Novel.update(id, validatedData);
        const updatedNovel = await Novel.findById(id);

        return successResponse(res, updatedNovel, 'Novela actualizada exitosamente');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al actualizar novela:', error);
        return errorResponse(res, 'Error al actualizar novela', 500);
    }
};

/**
 * Eliminar una novela
 */
export const deleteNovel = async (req, res) => {
    try {
        const { id } = req.params;
        const novel = await Novel.findById(id);

        if (!novel) {
            return notFoundResponse(res, 'Novela no encontrada');
        }

        // Verificar propiedad
        if (novel.user_id !== req.user.id && req.user.role !== 'admin') {
            return forbiddenResponse(res, 'No tienes permiso para eliminar esta novela');
        }

        await Novel.delete(id);

        return successResponse(res, null, 'Novela eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar novela:', error);
        return errorResponse(res, 'Error al eliminar novela', 500);
    }
};

/**
 * Obtener estadísticas de una novela
 */
export const getNovelStats = async (req, res) => {
    try {
        const { id } = req.params;
        const novel = await Novel.findById(id);

        if (!novel) {
            return notFoundResponse(res, 'Novela no encontrada');
        }

        // Verificar propiedad
        if (novel.user_id !== req.user.id && req.user.role !== 'admin') {
            return forbiddenResponse(res, 'No tienes permiso para acceder a esta novela');
        }

        const stats = await Novel.getStats(id);

        return successResponse(res, stats);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return errorResponse(res, 'Error al obtener estadísticas', 500);
    }
};
