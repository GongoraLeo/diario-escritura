import { z } from 'zod';
import { Note } from '../models/Note.js';
import { Novel } from '../models/Novel.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

const noteSchema = z.object({
    type: z.enum(['style', 'plot']),
    title: z.string().min(1),
    content: z.string().optional()
});

const checkNovelAccess = async (novelId, userId, userRole) => {
    const novel = await Novel.findById(novelId);
    if (!novel) return { error: 'Novela no encontrada', status: 404 };
    if (novel.user_id !== userId && userRole !== 'admin') {
        return { error: 'No tienes permiso', status: 403 };
    }
    return { novel };
};

export const createNote = async (req, res) => {
    try {
        const { novel_id } = req.body;
        const access = await checkNovelAccess(novel_id, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const validatedData = noteSchema.parse(req.body);
        const noteId = await Note.create({ novel_id, ...validatedData });
        const note = await Note.findById(noteId);

        return successResponse(res, note, 'Apunte creado exitosamente', 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear apunte:', error);
        return errorResponse(res, 'Error al crear apunte', 500);
    }
};

export const getNotesByNovel = async (req, res) => {
    try {
        const { novelId } = req.params;
        const { type } = req.query;

        const access = await checkNovelAccess(novelId, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const notes = await Note.findByNovelId(novelId, type);
        return successResponse(res, { notes, total: notes.length });
    } catch (error) {
        console.error('Error al obtener apuntes:', error);
        return errorResponse(res, 'Error al obtener apuntes', 500);
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
        if (!note) return notFoundResponse(res, 'Apunte no encontrado');

        const access = await checkNovelAccess(note.novel_id, req.user.id, req.user.role);
        if (access.error) return forbiddenResponse(res, access.error);

        const validatedData = noteSchema.partial().parse(req.body);
        await Note.update(id, validatedData);
        const updatedNote = await Note.findById(id);

        return successResponse(res, updatedNote, 'Apunte actualizado exitosamente');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al actualizar apunte:', error);
        return errorResponse(res, 'Error al actualizar apunte', 500);
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
        if (!note) return notFoundResponse(res, 'Apunte no encontrado');

        const access = await checkNovelAccess(note.novel_id, req.user.id, req.user.role);
        if (access.error) return forbiddenResponse(res, access.error);

        await Note.delete(id);
        return successResponse(res, null, 'Apunte eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar apunte:', error);
        return errorResponse(res, 'Error al eliminar apunte', 500);
    }
};
