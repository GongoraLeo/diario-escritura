import express from 'express';
import {
    createScene,
    getScenesByNovel,
    updateScene,
    deleteScene
} from '../controllers/sceneController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', createScene);
router.get('/novel/:novelId', getScenesByNovel);
router.put('/:id', updateScene);
router.delete('/:id', deleteScene);

export default router;
