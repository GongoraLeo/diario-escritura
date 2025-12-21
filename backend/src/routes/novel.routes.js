import express from 'express';
import {
    createNovel,
    getUserNovels,
    getNovelById,
    updateNovel,
    deleteNovel,
    getNovelStats
} from '../controllers/novelController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de novelas
router.post('/', createNovel);
router.get('/', getUserNovels);
router.get('/:id', getNovelById);
router.get('/:id/stats', getNovelStats);
router.put('/:id', updateNovel);
router.delete('/:id', deleteNovel);

export default router;
