import { z } from 'zod';
import { Character } from '../models/Character.js';
import { Novel } from '../models/Novel.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

// Esquema de validación
const characterSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(255),
    avatar: z.string().url().optional(),
    personal_data: z.object({}).passthrough().optional(),
    physical_appearance: z.object({}).passthrough().optional(),
    psychology: z.object({}).passthrough().optional(),
    goals: z.object({}).passthrough().optional(),
    past: z.object({}).passthrough().optional(),
    present: z.object({}).passthrough().optional(),
    future: z.object({}).passthrough().optional(),
    speech_patterns: z.object({}).passthrough().optional(),
    relationships: z.object({}).passthrough().optional(),
    additional_info: z.object({}).passthrough().optional()
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
 * Crear un nuevo personaje
 */
export const createCharacter = async (req, res) => {
    try {
        const { novel_id } = req.body;

        // Verificar acceso a la novela
        const access = await checkNovelAccess(novel_id, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const validatedData = characterSchema.parse(req.body);

        const characterId = await Character.create({
            novel_id,
            ...validatedData
        });

        const character = await Character.findById(characterId);

        return successResponse(res, character, 'Personaje creado exitosamente', 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear personaje:', error);
        return errorResponse(res, 'Error al crear personaje', 500);
    }
};

/**
 * Obtener todos los personajes de una novela
 */
export const getCharactersByNovel = async (req, res) => {
    try {
        const { novelId } = req.params;

        // Verificar acceso
        const access = await checkNovelAccess(novelId, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const characters = await Character.findByNovelId(novelId);

        return successResponse(res, {
            characters,
            total: characters.length
        });
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        return errorResponse(res, 'Error al obtener personajes', 500);
    }
};

/**
 * Obtener un personaje específico
 */
export const getCharacterById = async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Character.findById(id);

        if (!character) {
            return notFoundResponse(res, 'Personaje no encontrado');
        }

        // Verificar acceso a la novela
        const access = await checkNovelAccess(character.novel_id, req.user.id, req.user.role);
        if (access.error) {
            return forbiddenResponse(res, access.error);
        }

        return successResponse(res, character);
    } catch (error) {
        console.error('Error al obtener personaje:', error);
        return errorResponse(res, 'Error al obtener personaje', 500);
    }
};

/**
 * Actualizar un personaje
 */
export const updateCharacter = async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Character.findById(id);

        if (!character) {
            return notFoundResponse(res, 'Personaje no encontrado');
        }

        // Verificar acceso
        const access = await checkNovelAccess(character.novel_id, req.user.id, req.user.role);
        if (access.error) {
            return forbiddenResponse(res, access.error);
        }

        const validatedData = characterSchema.partial().parse(req.body);
        await Character.update(id, validatedData);

        const updatedCharacter = await Character.findById(id);

        return successResponse(res, updatedCharacter, 'Personaje actualizado exitosamente');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al actualizar personaje:', error);
        return errorResponse(res, 'Error al actualizar personaje', 500);
    }
};

/**
 * Eliminar un personaje
 */
export const deleteCharacter = async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Character.findById(id);

        if (!character) {
            return notFoundResponse(res, 'Personaje no encontrado');
        }

        // Verificar acceso
        const access = await checkNovelAccess(character.novel_id, req.user.id, req.user.role);
        if (access.error) {
            return forbiddenResponse(res, access.error);
        }

        await Character.delete(id);

        return successResponse(res, null, 'Personaje eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar personaje:', error);
        return errorResponse(res, 'Error al eliminar personaje', 500);
    }
};
