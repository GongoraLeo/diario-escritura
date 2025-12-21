import express from 'express';
import {
    getAllUsers,
    getUserById,
    toggleUserStatus,
    deleteUser,
    getUserStats
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de administrador
router.use(authMiddleware);
router.use(adminMiddleware);

// Rutas de administración
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
