import express from 'express';
import {
    createTrack,
    getTracksByNovel,
    updateTrack,
    deleteTrack,
    createEvent,
    getEventsByTrack,
    updateEvent,
    deleteEvent
} from '../controllers/timelineController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// Rutas de pistas
router.post('/tracks', createTrack);
router.get('/tracks/novel/:novelId', getTracksByNovel);
router.put('/tracks/:id', updateTrack);
router.delete('/tracks/:id', deleteTrack);

// Rutas de eventos
router.post('/events', createEvent);
router.get('/events/track/:trackId', getEventsByTrack);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
