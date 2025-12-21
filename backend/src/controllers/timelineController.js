import { z } from 'zod';
import { Timeline } from '../models/Timeline.js';
import { Novel } from '../models/Novel.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

const trackSchema = z.object({
    track_name: z.string().min(1),
    track_order: z.number().int().optional()
});

const eventSchema = z.object({
    title: z.string().min(1),
    date_chapter: z.string().optional(),
    characters: z.array(z.string()).optional(),
    description: z.string().optional(),
    importance: z.number().int().min(1).max(5).optional(),
    color: z.string().optional(),
    position_x: z.number().int().optional()
});

const checkNovelAccess = async (novelId, userId, userRole) => {
    const novel = await Novel.findById(novelId);
    if (!novel) return { error: 'Novela no encontrada', status: 404 };
    if (novel.user_id !== userId && userRole !== 'admin') {
        return { error: 'No tienes permiso', status: 403 };
    }
    return { novel };
};

// Controladores de pistas
export const createTrack = async (req, res) => {
    try {
        const { novel_id } = req.body;
        const access = await checkNovelAccess(novel_id, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const validatedData = trackSchema.parse(req.body);
        const trackId = await Timeline.createTrack({ novel_id, ...validatedData });
        const tracks = await Timeline.findTracksByNovelId(novel_id);
        const track = tracks.find(t => t.id === trackId);

        return successResponse(res, track, 'Pista creada exitosamente', 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear pista:', error);
        return errorResponse(res, 'Error al crear pista', 500);
    }
};

export const getTracksByNovel = async (req, res) => {
    try {
        const { novelId } = req.params;
        const access = await checkNovelAccess(novelId, req.user.id, req.user.role);
        if (access.error) {
            return access.status === 404
                ? notFoundResponse(res, access.error)
                : forbiddenResponse(res, access.error);
        }

        const tracks = await Timeline.findTracksByNovelId(novelId);
        return successResponse(res, { tracks, total: tracks.length });
    } catch (error) {
        console.error('Error al obtener pistas:', error);
        return errorResponse(res, 'Error al obtener pistas', 500);
    }
};

export const updateTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = trackSchema.partial().parse(req.body);
        await Timeline.updateTrack(id, validatedData);

        return successResponse(res, null, 'Pista actualizada exitosamente');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al actualizar pista:', error);
        return errorResponse(res, 'Error al actualizar pista', 500);
    }
};

export const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;
        await Timeline.deleteTrack(id);
        return successResponse(res, null, 'Pista eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar pista:', error);
        return errorResponse(res, 'Error al eliminar pista', 500);
    }
};

// Controladores de eventos
export const createEvent = async (req, res) => {
    try {
        const { timeline_id } = req.body;
        const validatedData = eventSchema.parse(req.body);
        const eventId = await Timeline.createEvent({ timeline_id, ...validatedData });
        const event = await Timeline.findEventById(eventId);

        return successResponse(res, event, 'Evento creado exitosamente', 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al crear evento:', error);
        return errorResponse(res, 'Error al crear evento', 500);
    }
};

export const getEventsByTrack = async (req, res) => {
    try {
        const { trackId } = req.params;
        const events = await Timeline.findEventsByTrackId(trackId);
        return successResponse(res, { events, total: events.length });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return errorResponse(res, 'Error al obtener eventos', 500);
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = eventSchema.partial().parse(req.body);
        await Timeline.updateEvent(id, validatedData);
        const updatedEvent = await Timeline.findEventById(id);

        return successResponse(res, updatedEvent, 'Evento actualizado exitosamente');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return validationErrorResponse(res, error.errors);
        }
        console.error('Error al actualizar evento:', error);
        return errorResponse(res, 'Error al actualizar evento', 500);
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Timeline.deleteEvent(id);
        return successResponse(res, null, 'Evento eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return errorResponse(res, 'Error al eliminar evento', 500);
    }
};
