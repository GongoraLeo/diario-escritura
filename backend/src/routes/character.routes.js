import express from 'express';
import {
    createCharacter,
    getCharactersByNovel,
    getCharacterById,
    updateCharacter,
    deleteCharacter
} from '../controllers/characterController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de personajes
router.post('/', createCharacter);
router.get('/novel/:novelId', getCharactersByNovel);
router.get('/:id', getCharacterById);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;
