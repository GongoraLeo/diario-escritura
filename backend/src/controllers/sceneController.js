import { z } from 'zod';
import { Scene } from '../models/Scene.js';
import { Novel } from '../models/Novel.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

const sceneSchema = z.object({
    scene_number: z.number().int().positive(),
    location: z.string().optional(),
    time_of_day: z.enum(['day', 'night', 'dawn', 'dusk']).optional(),
    characters: z.array(z.string()).optional(),
    pov: z.string().optional(),
    objective: z.string().optional(),
    description: z.string().optional(),
    language_features: z.object({}).passthrough().optional(),
    themes: z.array(z.string()).optional(),
    dramatic_beats: z.array(z.string()).optional(),
    plot_connection: z.string().optional(),
    emotional_state: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['draft', 'complete', 'revision']).optional()
});

const checkNovelAccess = async (novelId, userId, userRole) => {
    const novel = await Novel.findById(novelId);
    if (!novel) return { error: 'Novela no encontrada', status: 404 };
    if (novel.user_id !== userId && userRole !== 'admin') {
        return { error: 'No tienes permiso', status: 403 };
    }
    return { novel };
};

export const createScene = async (req, res) => {
    try {
        const { novel_id } = req.body;
        const access = await checkNovelAccess(novel_id, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const validatedData = sceneSchema.parse(req.body);
        const sceneId = await Scene.create({ novel_id, ...validatedData });
        const scene = await Scene.findById(sceneId);

        return successResponse(res, scene, 'Escena creada exitosamente', 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear escena:', error);
        return errorResponse(res, 'Error al crear escena', 500);
    }
};

export const getScenesByNovel = async (req, res) => {
    try {
        const { novelId } = req.params;
        const access = await checkNovelAccess(novelId, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const scenes = await Scene.findByNovelId(novelId);
        return successResponse(res, { scenes, total: scenes.length });
    } catch (error) {
        console.error('Error al obtener escenas:', error);
        return errorResponse(res, 'Error al obtener escenas', 500);
    }
};

export const updateScene = async (req, res) => {
    try {
        const { id } = req.params;
        const scene = await Scene.findById(id);
        if (!scene) return notFoundResponse(res, 'Escena no encontrada');

        const access = await checkNovelAccess(scene.novel_id, req.user.id, req.user.role);
        if (access.error) return forbiddenResponse(res, access.error);

        const validatedData = sceneSchema.partial().parse(req.body);
        await Scene.update(id, validatedData);
        const updatedScene = await Scene.findById(id);

        return successResponse(res, updatedScene, 'Escena actualizada exitosamente');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al actualizar escena:', error);
        return errorResponse(res, 'Error al actualizar escena', 500);
    }
};

export const deleteScene = async (req, res) => {
    try {
        const { id } = req.params;
        const scene = await Scene.findById(id);
        if (!scene) return notFoundResponse(res, 'Escena no encontrada');

        const access = await checkNovelAccess(scene.novel_id, req.user.id, req.user.role);
        if (access.error) return forbiddenResponse(res, access.error);

        await Scene.delete(id);
        return successResponse(res, null, 'Escena eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar escena:', error);
        return errorResponse(res, 'Error al eliminar escena', 500);
    }
};
