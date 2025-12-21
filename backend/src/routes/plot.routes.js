import express from 'express';
import {
    createOrUpdatePlot,
    getPlotByNovel,
    deletePlot
} from '../controllers/plotController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de tramas
router.post('/', createOrUpdatePlot);
router.get('/novel/:novelId', getPlotByNovel);
router.delete('/:id', deletePlot);

export default router;
