import express from 'express';
import {
    createNote,
    getNotesByNovel,
    updateNote,
    deleteNote
} from '../controllers/notesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', createNote);
router.get('/novel/:novelId', getNotesByNovel);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
