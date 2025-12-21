import { z } from 'zod';
import { Plot } from '../models/Plot.js';
import { Novel } from '../models/Novel.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

// Esquema de validación
const plotSchema = z.object({
    structure_type: z.enum(['3_acts', '5_acts', 'hero_journey', 'save_cat', 'story_circle', 'free']),
    plot_points: z.object({}).passthrough()
});

/**
 * Verificar acceso a la novela
 */
const checkNovelAccess = async (novelId, userId, userRole) => {
    const novel = await Novel.findById(novelId);
    if (!novel) {
        return { error: 'Novela no encontrada', status: 404 };
    }
    if (novel.user_id !== userId && userRole !== 'admin') {
        return { error: 'No tienes permiso para acceder a esta novela', status: 403 };
    }
    return { novel };
};

/**
 * Crear o actualizar trama de una novela
 */
export const createOrUpdatePlot = async (req, res) => {
    try {
        const { novel_id } = req.body;

        // Verificar acceso
        const access = await checkNovelAccess(novel_id, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const validatedData = plotSchema.parse(req.body);

        // Verificar si ya existe una trama para esta novela
        const existingPlot = await Plot.findByNovelId(novel_id);

        if (existingPlot) {
            // Actualizar
            await Plot.update(existingPlot.id, validatedData);
            const updatedPlot = await Plot.findById(existingPlot.id);
            return successResponse(res, updatedPlot, 'Trama actualizada exitosamente');
        } else {
            // Crear
            const plotId = await Plot.create({
                novel_id,
                ...validatedData
            });
            const plot = await Plot.findById(plotId);
            return successResponse(res, plot, 'Trama creada exitosamente', 201);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear/actualizar trama:', error);
        return errorResponse(res, 'Error al crear/actualizar trama', 500);
    }
};

/**
 * Obtener trama de una novela
 */
export const getPlotByNovel = async (req, res) => {
    try {
        const { novelId } = req.params;

        // Verificar acceso
        const access = await checkNovelAccess(novelId, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const plot = await Plot.findByNovelId(novelId);

        if (!plot) {
            return notFoundResponse(res, 'Esta novela aún no tiene una trama definida');
        }

        return successResponse(res, plot);
    } catch (error) {
        console.error('Error al obtener trama:', error);
        return errorResponse(res, 'Error al obtener trama', 500);
    }
};

/**
 * Eliminar trama
 */
export const deletePlot = async (req, res) => {
    try {
        const { id } = req.params;
        const plot = await Plot.findById(id);

        if (!plot) {
            return notFoundResponse(res, 'Trama no encontrada');
        }

        // Verificar acceso
        const access = await checkNovelAccess(plot.novel_id, req.user.id, req.user.role);
        if (access.error) {
            return forbiddenResponse(res, access.error);
        }

        await Plot.delete(id);

        return successResponse(res, null, 'Trama eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar trama:', error);
        return errorResponse(res, 'Error al eliminar trama', 500);
    }
};
